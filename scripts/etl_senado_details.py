import os
import requests
import xmltodict
import time
import hashlib
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Usar variables de entorno (Local o GitHub Actions)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_xml(url):
    try:
        r = requests.get(url, timeout=30)
        if r.status_code == 200:
            return xmltodict.parse(r.content)
    except Exception as e:
        pass
    return None

def generate_votacion_id(boletin, fecha_str, tema):
    """Genera un ID entero determinista para la votación basado en sus datos únicos"""
    raw_str = f"{boletin}-{fecha_str}-{tema}"
    # Hash SHA256 y tomar primeros 8 bytes como entero (cabe en integer postgres? 2e9. Mejor usar bigint o truncate)
    # Postgres integer is 4 bytes (max 2,147,483,647).
    # Usaremos hash positivo modulo 2000000000 para evitar overflow y colisión con Cámara (que usa IDs pequeños 1-50000)
    # Cámara usa IDs secuenciales ~20k-40k. Nosotros usaremos rango 100M+ para Senado.
    h = hashlib.md5(raw_str.encode('utf-8')).hexdigest()
    return 100000000 + (int(h, 16) % 900000000) 

def clean_parlamentario_name(raw_name):
    # Formato Senado: "Tuma Z., Eugenio" -> "Eugenio Tuma Z." o buscar por apellido
    # Nuestra DB: nombre, apellido_paterno, apellido_materno
    parts = raw_name.split(",")
    if len(parts) == 2:
        apellido = parts[0].strip()
        nombre = parts[1].strip()
        return nombre, apellido
    return raw_name, ""

def load_senadores_map():
    print("Cargando mapa de Senadores desde DB...")
    resp = supabase.table('senadores').select("id, nombre, apellido_paterno, apellido_materno").execute()
    data = resp.data
    # Crear mapa flexible por apellido
    senadores_map = {}
    for s in data:
        # Claves de búsqueda: "ApellidoPaterno", "ApellidoPaterno ApellidoMaterno"
        key_p = s['apellido_paterno'].lower()
        if key_p not in senadores_map: senadores_map[key_p] = []
        senadores_map[key_p].append(s)
        
    return senadores_map

def find_senador_id(nombre, apellido_raw, senadores_map):
    # apellido_raw viene como "Tuma Z." o "Coloma C."
    # Limpiamos punto y inicial materno
    apellido_clean = apellido_raw.split(" ")[0].lower() # "tuma"
    
    candidates = senadores_map.get(apellido_clean)
    if not candidates:
        return None
    
    if len(candidates) == 1:
        return candidates[0]['id']
    
    # Desempate por nombre
    nombre_lower = nombre.lower()
    for c in candidates:
        if c['nombre'].lower() in nombre_lower or nombre_lower in c['nombre'].lower():
            return c['id']
            
    return candidates[0]['id'] # Fallback al primero

def load_senado_details():
    print("--- ETL Detalle Votaciones Senado ---")
    senadores_map = load_senadores_map()
    
    # Obtener boletines del periodo legislativo actual (iniciados >= 2022 o tramitados, pero solo tenemos fecha_ingreso)
    # Para ser exhaustivos con Senado, podemos tomar los mismos que la camara o todos.
    print("Obteniendo boletines recientes...")
    boletines_resp = supabase.table('proyectos_ley') \
        .select("boletin") \
        .gte("fecha_ingreso", "2022-03-11") \
        .execute()
    boletines = boletines_resp.data
    
    print(f"Procesando {len(boletines)} boletines...")
    
    for b in boletines:
        boletin_raw = b['boletin']
        # La API de votaciones.php parece que prefiere SIN dígito verificador para algunos casos, o con ambos.
        # En el ejemplo manual funcionó con "8575" (sin guion) para obtener resultado.
        # PERO, mi debug anterior mostro que "8575-07" retornó JSON vacío o error si mal no recuerdo, y "8575" funcionó.
        # Wait, re-leyendo el output del debug:
        # Votaciones (sin guion)... boletin=8575 ... Status 200 ... "votacion": [...] EXITOSO.
        # Votaciones (con guion)... boletin=8575-07 ... Status 200 ... "votaciones": null (o vacio)
        
        # Estrategia: Quitar guion y DV
        if "-" in boletin_raw:
            boletin_query = boletin_raw.split("-")[0]
        else:
            boletin_query = boletin_raw
            
        url = f"https://tramitacion.senado.cl/wspublico/votaciones.php?boletin={boletin_query}"
        
        data = fetch_xml(url)
        if not data: 
            time.sleep(0.2)
            continue
            
        vots_wrapper = data.get('votaciones', {})
        if not vots_wrapper: continue
        
        vots = vots_wrapper.get('votacion', [])
        if isinstance(vots, dict): vots = [vots] # Un solo elemento
        
        if not vots: continue
        
        print(f"  Boletin {boletin_raw}: {len(vots)} votaciones encontradas.")
        
        count_votos_ok = 0
        
        for v in vots:
            try:
                # 1. Header Votación
                fecha_str = v.get('FECHA') # DD/MM/YYYY
                tema = v.get('TEMA')
                
                # Parse fecha
                try:
                    fecha_iso = datetime.strptime(fecha_str, "%d/%m/%Y").isoformat()
                except:
                    fecha_iso = None
                
                # Generar ID único
                vid = generate_votacion_id(boletin_raw, fecha_str, tema[:50])
                
                # Upsert Header
                supabase.table('votaciones_sala').upsert({
                    "id": vid,
                    "boletin": boletin_raw, # Link FK
                    "fecha": fecha_iso,
                    "materia": str(tema)[:500],
                    "resultado": f"Sí: {v.get('SI')}, No: {v.get('NO')}, Abs: {v.get('ABSTENCION')}",
                    "quorum": v.get('QUORUM'),
                    "tipo_votacion": v.get('TIPOVOTACION'),
                    "updated_at": datetime.now().isoformat()
                }, on_conflict='id').execute()
                
                # 2. Detalle Votos
                detalles = v.get('DETALLE_VOTACION', {}).get('VOTO', [])
                if isinstance(detalles, dict): detalles = [detalles]
                
                votos_db = []
                for d in detalles:
                    parl_raw = d.get('PARLAMENTARIO')
                    seleccion = d.get('SELECCION')
                    
                    nombre, apellido = clean_parlamentario_name(parl_raw)
                    sid = find_senador_id(nombre, apellido, senadores_map)
                    
                    if sid:
                        votos_db.append({
                            "votacion_id": vid,
                            "parlamentario_id": sid,
                            "camara": "Senado",
                            "nombre_parlamentario": parl_raw,
                            "opcion_voto": seleccion
                        })
                
                if votos_db:
                    supabase.table('fact_votaciones_detalle').insert(votos_db).execute()
                    count_votos_ok += len(votos_db)
                    
            except Exception as e:
                # print(f"Error procesando votacion senado: {e}")
                pass
        
        if count_votos_ok > 0:
            print(f"    -> Guardados {count_votos_ok} votos de senadores.")
            
        time.sleep(0.3)

if __name__ == "__main__":
    load_senado_details()
