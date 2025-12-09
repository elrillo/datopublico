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

# --- Funciones Auxiliares ---
def fetch_xml(url):
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        return xmltodict.parse(r.content)
    except Exception as e:
        print(f"Error cargando {url}: {e}")
        return None

# --- CARGA DE COMISIONES ---
def load_comisiones():
    print("--- Cargando Comisiones ---")
    items = []
    
    # 1. Cámara de Diputados
    url_camara = "https://opendata.camara.cl/wscamaradiputados.asmx/getComisiones_Vigentes"
    data = fetch_xml(url_camara)
    if data:
        comisiones = data.get('Comisiones', {}).get('Comision', [])
        if not isinstance(comisiones, list): comisiones = [comisiones]
        
        for c in comisiones:
            items.append({
                "id": f"DIP-{c.get('ID')}",
                "nombre": c.get('Nombre'),
                "tipo": c.get('Tipo'),
                "camara": "Diputados",
                "correo": c.get('Correo'),
                "updated_at": datetime.now().isoformat()
            })
            
    # 2. Senado
    url_senado = "https://tramitacion.senado.cl/wspublico/comisiones.php"
    data = fetch_xml(url_senado)
    if data:
        comisiones = data.get('comisiones', {}).get('comision', [])
        if not isinstance(comisiones, list): comisiones = [comisiones]
        
        for c in comisiones:
            items.append({
                "id": f"SEN-{c.get('id')}",
                "nombre": c.get('nombre'),
                "tipo": c.get('tipo'),
                "camara": "Senado",
                "correo": c.get('email'),
                "integrantes_json": c.get('integrantes'), # Snapshot
                "updated_at": datetime.now().isoformat()
            })

    # Upsert
    if items:
        print(f"Upserting {len(items)} comisiones...")
        supabase.table('dim_comisiones').upsert(items, on_conflict='id').execute()

# --- CARGA DE PARLAMENTARIOS HISTÓRICOS ---
def load_parlamentarios_historicos():
    print("\n--- Cargando Parlamentarios Históricos (Cámara) ---")
    
    # Obtener periodos
    url_periodos = "https://opendata.camara.cl/wscamaradiputados.asmx/getPeriodosLegislativos"
    data_p = fetch_xml(url_periodos)
    periodos = data_p.get('PeriodosLegislativo', {}).get('PeriodoLegislativo', [])
    
    total_diputados = 0
    
    for p in periodos:
        pid = p.get('ID')
        print(f"  Procesando Periodo {pid}...")
        
        url_dip = f"https://opendata.camara.cl/wscamaradiputados.asmx/getDiputados_Periodo?prmPeriodoID={pid}"
        data_d = fetch_xml(url_dip)
        
        if not data_d: continue
        
        diputados_raw = data_d.get('Diputados', {}).get('Diputado', [])
        if not isinstance(diputados_raw, list): diputados_raw = [diputados_raw]
        
        items = []
        for d in diputados_raw:
            try:
                # Manejar Militancias de forma segura
                militancia = None
                m_raw = d.get('Militancias_Periodos', {}).get('Militancia_Periodo', [])
                if isinstance(m_raw, list) and len(m_raw) > 0:
                    militancia = m_raw[0].get('Partido')
                elif isinstance(m_raw, dict):
                    militancia = m_raw.get('Partido')
                
                # Campos básicos compatibles con tabla diputados existente
                items.append({
                    "id": int(d.get('DIPID')),
                    "nombre": d.get('Nombre'),
                    "apellido_paterno": d.get('Apellido_Paterno'),
                    "apellido_materno": d.get('Apellido_Materno'),
                    "partido": militancia,
                    "url_foto": f"http://www.camara.cl/img.aspx?pId={d.get('DIPID')}&pT=1",
                    "updated_at": datetime.now().isoformat()
                })
            except Exception as e:
                print(f"Error procesando diputado {d}: {e}")

        if items:
            try:
                # Ignore duplicates para no sobrescribir datos más recientes si ya existen
                supabase.table('diputados').upsert(items, on_conflict='id', ignore_duplicates=True).execute()
                total_diputados += len(items)
            except Exception as e:
                # Si falla, intentar upsert normal
                print(f"Retry upsert for period {pid}: {e}")

        time.sleep(0.5)

    print(f"Total Diputados Históricos procesados: {total_diputados}")
    
    # Senado histórico: La API SOAP del senado es limitada.
    # Usaremos senadores_vigentes para asegurar los actuales.
    # Para históricos reales del senado necesitaríamos scraping o una API no documentada en "wspublico".
    # Por ahora, solo refrescamos vigentes.

if __name__ == "__main__":
    load_comisiones()
    load_parlamentarios_historicos()
