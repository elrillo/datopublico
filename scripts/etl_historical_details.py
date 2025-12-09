import os
import requests
import xmltodict
import time
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
        r.raise_for_status()
        return xmltodict.parse(r.content)
    except Exception as e:
        # print(f"Error cargando {url}: {e}")
        return None

def load_diario_sesion():
    print("--- Cargando Detalle Diario de Sesiones ---")
    
    # 1. Obtener sesiones sin detalle (o todas)
    # limitamos a 50 para demo
    response = supabase.table('sesiones').select("id").limit(50).execute()
    sesiones = response.data
    
    for s in sesiones:
        sid_raw = s['id'] # DIP-1234
        if not sid_raw.startswith("DIP-"): continue
        
        sid = sid_raw.replace("DIP-", "")
        # print(f"Procesando detalle sesión {sid}...", end='\r')
        
        # Endpoint detalle
        url = f"https://opendata.camara.cl/wscamaradiputados.asmx/getSesionDetalle?prmSesionID={sid}"
        data = fetch_xml(url)
        
        if data:
            detalle = data.get('Sesion', {})
            
            # Extraer Cuenta
            cuenta = detalle.get('Cuenta', {}).get('Cuenta', None)
            if cuenta:
                texto_cuenta = str(cuenta) # Puede ser lista o dict
                supabase.table('fact_diario_sesion').insert({
                    "sesion_id": sid_raw,
                    "seccion": "Cuenta",
                    "contenido": texto_cuenta[:5000], # Truncar por si aca
                    "contenido_raw": {"raw": cuenta}
                }).execute()
                
            # Extraer Orden del Dia
            orden = detalle.get('OrdenDia', {}).get('OrdenDia', None)
            if orden:
                texto_orden = str(orden)
                supabase.table('fact_diario_sesion').insert({
                    "sesion_id": sid_raw,
                    "seccion": "OrdenDelDia",
                    "contenido": texto_orden[:5000],
                    "contenido_raw": {"raw": orden}
                }).execute()
        
        time.sleep(0.2)
    print("\nDetalle de sesiones cargado y procesado.")

def load_votaciones_detalle():
    print("\n--- Cargando Votaciones Detalle ---")
    # Para votaciones necesitamos primero tener votaciones_sala llenas.
    # Como el script diario de diputados las desactivó, primero deberíamos poblarlas.
    # Asumiremos que existen algunas o las poblaremos desde boletines.
    
    # Filtrar proyectos del periodo actual (desde 11 Marzo 2022)
    print("Obteniendo boletines del periodo actual (>= 2022-03-11)...")
    boletines_resp = supabase.table('proyectos_ley') \
        .select("boletin") \
        .gte("fecha_ingreso", "2022-03-11") \
        .execute()
        
    boletines = boletines_resp.data
    print(f"Procesando detalles para {len(boletines)} boletines...")
    
    for b in boletines:
        boletin_id = b['boletin']
        # Limpiar sufijo si es necesario para camara
        
        # Endpoint Votaciones del Boletin (Camara)
        url_vot = f"https://opendata.camara.cl/wscamaradiputados.asmx/getVotaciones_Boletin?prmBoletin={boletin_id}"
        data_v = fetch_xml(url_vot)
        
        if data_v:
            vots = data_v.get('Votaciones', {}).get('Votacion', [])
            if not isinstance(vots, list): vots = [vots]
            
            for v in vots:
                vid = v.get('ID')
                if not vid: continue
                
                # 1. Guardar Votacion Sala (Header)
                try:
                    print(f"    -> Procesando Votación {vid}...")
                    fecha_iso = None
                    if v.get('Fecha'):
                        fecha_iso = datetime.strptime(v.get('Fecha'), "%Y-%m-%dT%H:%M:%S").isoformat()
                        
                    res_text = v.get('Resultado', {})
                    if isinstance(res_text, dict): res_text = res_text.get('#text')
                        
                    supabase.table('votaciones_sala').upsert({
                        "id": int(vid),
                        "boletin": boletin_id, # Link FK
                        "fecha": fecha_iso,
                        "materia": str(v.get('Tipo', {}).get('Nombre')),
                        "resultado": str(res_text),
                        "quorum": str(v.get('Quorum', {}).get('Nombre')),
                        "updated_at": datetime.now().isoformat()
                    }, on_conflict='id').execute()
                except Exception as e:
                    print(f"    Error header votacion {vid}: {e}")
                    continue

                # 2. Obtener Detalle Votos (Cada diputado)
                url_det = f"https://opendata.camara.cl/wscamaradiputados.asmx/getVotacion_Detalle?prmVotacionID={vid}"
                data_d = fetch_xml(url_det)
                
                if data_d:
                    votos = data_d.get('Votacion', {}).get('Votos', {}).get('Voto', [])
                    if not isinstance(votos, list): votos = [votos]
                    
                    votos_db = []
                    for voto in votos:
                        dip = voto.get('Diputado', {})
                        opcion = voto.get('OpcionVoto', {})
                        if isinstance(opcion, dict): opcion = opcion.get('Nombre')
                        
                        votos_db.append({
                            "votacion_id": int(vid),
                            "parlamentario_id": int(dip.get('DIPID')),
                            "camara": "Diputados",
                            "nombre_parlamentario": f"{dip.get('Nombre')} {dip.get('Apellido_Paterno')}",
                            "opcion_voto": str(opcion)
                        })
                    
                    if votos_db:
                        # Insertar detalle (sin conflicto ID, es tabla masiva)
                        supabase.table('fact_votaciones_detalle').insert(votos_db).execute()
                        print(f"      -> Guardados {len(votos_db)} votos detalle.")
                        
                time.sleep(0.2)
        
        time.sleep(0.2)
    
    print("Votaciones detalladas cargadas.")

if __name__ == "__main__":
    # load_diario_sesion() # Opcional, foco en votaciones ahora
    load_votaciones_detalle()
