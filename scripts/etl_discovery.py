import os
import requests
import xmltodict
from datetime import datetime
import time
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_xml(url):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        return xmltodict.parse(resp.content)
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        if 'resp' in locals():
            print(f"Response text: {resp.text[:200]}")
        return None

def extract_boletines_from_sesion(sesion_id):
    url = f"https://opendata.camara.cl/wscamaradiputados.asmx/getSesionBoletinXML?prmSesionID={sesion_id}"
    data = fetch_xml(url)
    if not data: return []
    
    boletines = set()
    
    try:
        sesion_node = data.get('BOLETINXML', {}).get('SESION', {})
        
        # Lugares donde buscar proyectos: ORDEN_DIA, CUENTA, TABLA (si existe)
        # La estructura es compleja y variable.
        # Vamos a buscar recursivamente cualquier llave "Proyecto" o "Boletin"
        
        def recursive_search(d):
            if isinstance(d, dict):
                for k, v in d.items():
                    if k in ['Proyecto', 'PROYECTO_LEY']:
                        # A veces es lista, a veces dict
                        if isinstance(v, list):
                            for p in v:
                                if isinstance(p, dict):
                                    # Probar varias llaves posibles
                                    b = p.get('@Boletin') or p.get('Boletin') or p.get('@BOLETIN')
                                    if b: boletines.add(b)
                        elif isinstance(v, dict):
                            b = v.get('@Boletin') or v.get('Boletin') or v.get('@BOLETIN')
                            if b: boletines.add(b)
                    
                    recursive_search(v)
            elif isinstance(d, list):
                for i in d:
                    recursive_search(i)
                    
        recursive_search(sesion_node)
        
    except Exception as e:
        print(f"Error parsing sesion {sesion_id}: {e}")
        
    return list(boletines)

def main():
    print("--- Iniciando Descubrimiento de Boletines ---")
    
    # 1. Obtener Legislaturas (Iteramos las ultimas 3 para probar)
    url_leg = "https://opendata.camara.cl/wscamaradiputados.asmx/getLegislaturas"
    data_leg = fetch_xml(url_leg)
    
    legislaturas = data_leg.get('Legislaturas', {}).get('Legislatura', [])
    # Ordenar por ID descendente para ver lo más reciente
    legislaturas.sort(key=lambda x: int(x['ID']), reverse=True)
    
    total_boletines_found = 0
    
    # Tomamos las ultimas 5 legislaturas para tener historia reciente
    for leg in legislaturas[:5]:
        leg_id = leg['ID']
        print(f"\nProcesando Legislatura {leg_id}...")
        
        # 2. Obtener Sesiones de la Legislatura
        url_ses = f"https://opendata.camara.cl/wscamaradiputados.asmx/getSesiones?prmLegislaturaID={leg_id}"
        data_ses = fetch_xml(url_ses)
        sesiones = data_ses.get('Sesiones', {}).get('Sesion', [])
        
        if not isinstance(sesiones, list): sesiones = [sesiones]
        
        # ORDENAR SESIONES DESCENDENTE (ID mayor primero) para ver lo más reciente
        sesiones.sort(key=lambda x: int(x['ID']), reverse=True)
        
        print(f"  Encontradas {len(sesiones)} sesiones. Procesando las últimas 20...")
        
        # Procesar sesiones (guardar en DB y buscar boletines)
        sesiones_to_process = sesiones[:20] 
        
        # Preparar datos para tabla 'sesiones'
        sesiones_db_items = []
        for s in sesiones_to_process:
            try:
                # Parsear fecha ISO
                fecha = s.get('Fecha')
                if fecha:
                    try:
                         fecha = datetime.strptime(fecha, "%Y-%m-%dT%H:%M:%S").isoformat()
                    except: pass
                
                sesiones_db_items.append({
                    "id": f"DIP-{s.get('ID')}", # Prefijo para distinguir de Senado
                    "camara": "Diputados",
                    "numero": int(s.get('Numero', 0)),
                    "legislatura": int(leg_id),
                    "fecha": fecha,
                    "tipo": s.get('Tipo'),
                    "updated_at": datetime.now().isoformat()
                })
            except Exception as e:
                print(f"Error parseando sesión db item: {e}")

        # Guardar sesiones en lote
        if sesiones_db_items:
            try:
                supabase.table('sesiones').upsert(sesiones_db_items, on_conflict='id').execute()
                print(f"    Guardadas {len(sesiones_db_items)} sesiones en DB.")
            except Exception as e:
                print(f"    Error guardando sesiones: {e}")

        # Buscar boletines en estas sesiones
        for ses in sesiones_to_process:
            ses_id = ses['ID']
            boletines = extract_boletines_from_sesion(ses_id)
            if boletines:
                print(f"    Sesión {ses_id}: Encontrados {len(boletines)} boletines.")
                items = [{"boletin": b} for b in boletines]
                try:
                    supabase.table('proyectos_ley').upsert(items, on_conflict='boletin', ignore_duplicates=True).execute()
                    total_boletines_found += len(boletines)
                except Exception as e:
                    print(f"    Error guardando boletines: {e}")
            
            time.sleep(0.5) # Rate limit
            
    print(f"\n--- Descubrimiento Finalizado. Total nuevos boletines potenciales: {total_boletines_found} ---")

if __name__ == "__main__":
    main()
