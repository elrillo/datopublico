import os
import requests
import xmltodict
import time
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Forzar credenciales LEGISLATIVO (Open Data)
SUPABASE_URL = "https://tbniuckpxxzphturwnaj.supabase.co"
SUPABASE_KEY = "sb_secret_qwNGeDMU3wzM2rMj04nZww_cI4G3e68"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_xml(url):
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        return xmltodict.parse(r.content)
    except Exception as e:
        print(f"Error cargando {url}: {e}")
        return None

# --- CARGA MASIVA DE SESIONES HISTÓRICAS ---
def load_historical_sessions():
    print("--- Cargando Sesiones Históricas (Todas las Legislaturas) ---")
    
    url_leg = "https://opendata.camara.cl/wscamaradiputados.asmx/getLegislaturas"
    data = fetch_xml(url_leg)
    legislaturas = data.get('Legislaturas', {}).get('Legislatura', [])
    
    # Ordenar ID descendente para empezar por lo más nuevo
    legislaturas.sort(key=lambda x: int(x['ID']), reverse=True)
    
    total_sessions = 0
    
    for leg in legislaturas:
        lid = leg['ID']
        print(f"Procesando Legislatura {lid}...")
        
        url_ses = f"https://opendata.camara.cl/wscamaradiputados.asmx/getSesiones?prmLegislaturaID={lid}"
        data_s = fetch_xml(url_ses)
        
        if not data_s: continue
        
        sesiones = data_s.get('Sesiones', {}).get('Sesion', [])
        if not isinstance(sesiones, list): sesiones = [sesiones]
        
        items = []
        for s in sesiones:
            try:
                # Parse fecha
                fecha_iso = None
                if s.get('Fecha'):
                    try:
                        fecha_iso = datetime.strptime(s.get('Fecha'), "%Y-%m-%dT%H:%M:%S").isoformat()
                    except: pass
                
                items.append({
                    "id": f"DIP-{s.get('ID')}",
                    "camara": "Diputados",
                    "numero": int(s.get('Numero', 0)),
                    "legislatura": int(lid),
                    "fecha": fecha_iso,
                    "tipo": s.get('Tipo'),
                    "updated_at": datetime.now().isoformat()
                })
            except Exception as e:
                print(f"Error parsing session {s}: {e}")
        
        if items:
            try:
                # Upsert en lotes de 100
                for i in range(0, len(items), 100):
                    batch = items[i:i+100]
                    supabase.table('sesiones').upsert(batch, on_conflict='id').execute()
                total_sessions += len(items)
            except Exception as e:
                print(f"Error upserting sessions: {e}")
                
        time.sleep(0.5)
        
    print(f"Total Sesiones cargadas: {total_sessions}")

# --- CARGA MASIVA DE HISTÓRICO DE PROYECTOS (Rango) ---
def load_historical_projects():
    print("\n--- Cargando Proyectos de Ley (Barrido Histórico) ---")
    # Boletines van aprox del 1 al 17000.
    # Barreremos del 5000 al 17000 en bloques.
    
    # BARRIDO PERIODO ACTUAL (2022-2024+)
    # Boletín 14700 aprox es Feb/Marzo 2022
    start_id = 14700
    end_id = 17000 # Un poco más allá del actual para asegurar
    
    total_proyectos = 0
    print(f"Barreremos del {start_id} al {end_id} (Periodo Legislativo Actual).")
    for bol_num in range(start_id, end_id):
        boletin = f"{bol_num}-07" # Sufijo común cámara, pero puede ser -03, -04...
        # El endpoint tramitacion.php acepta boletin SIN dígito verificador a veces, o requiere probar.
        # Probemos solo el número.
        
        url = f"https://tramitacion.senado.cl/wspublico/tramitacion.php?boletin={bol_num}"
        
        # print(f"Checking {bol_num}...", end='\r')
        data = fetch_xml(url)
        
        if data:
            try:
                # xmltodict retorna None a veces si vacio
                if not data: continue
                proj = data.get('proyectos', {}).get('proyecto')
                if proj:
                    # Procesar
                    try:
                        desc = proj.get('descripcion', {})
                        fecha_raw = desc.get('fecha_ingreso')
                        fecha_iso = None
                        if fecha_raw:
                            try:
                                fecha_iso = datetime.strptime(fecha_raw, "%d/%m/%Y").date().isoformat()
                            except: pass
                            
                        item = {
                            "boletin": desc.get('boletin'),
                            "titulo": desc.get('titulo'),
                            "fecha_ingreso": fecha_iso,
                            "iniciativa": desc.get('iniciativa'),
                            "camara_origen": desc.get('camara_origen'),
                            "etapa": desc.get('etapa'),
                            "link_tramitacion": desc.get('link_mensaje_mocion'),
                            "updated_at": datetime.now().isoformat()
                        }
                        
                        supabase.table('proyectos_ley').upsert(item, on_conflict='boletin').execute()
                        total_proyectos += 1
                        if total_proyectos % 100 == 0:
                            print(f"  Cargados {total_proyectos} proyectos...")
                    except Exception as e:
                        print(f"Error saving project {bol_num}: {e}")
                else:
                    # Marcar error flag si no existe
                    pass
            except Exception as e:
               pass # print(f"Error parse xml structure {bol_num}: {e}")
        
        time.sleep(0.2)
        
    print(f"\nTotal Proyectos Históricos cargados: {total_proyectos}")

if __name__ == "__main__":
    # load_historical_sessions() # Ya cargadas, comentamos para foco en proyectos
    load_historical_projects()
