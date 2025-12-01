import os
import requests
import xmltodict
import time
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime

# Cargar variables de entorno
load_dotenv()

# Configuración de Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Faltan las credenciales de Supabase en el archivo .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_and_parse(url, root_key=None):
    """
    Descarga XML desde la URL y lo convierte a diccionario.
    Maneja reintentos y timeouts.
    """
    print(f"Consultando: {url}")
    max_retries = 3
    retry_delay = 5
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=60)
            response.raise_for_status()
            
            # Parsear XML
            data_dict = xmltodict.parse(response.content)
            
            # Si se especifica una clave raíz, intentar navegar a ella para simplificar
            # La API de la cámara suele envolver todo en namespaces raros a veces
            return data_dict
            
        except Exception as e:
            print(f"Intento {attempt + 1}/{max_retries} fallido: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (attempt + 1))
            else:
                print("Error persistente al conectar con API Cámara.")
                return None

def process_diputados(data):
    """
    Procesa la lista de diputados.
    Estructura esperada XML: <Diputados><Diputado>...</Diputado></Diputados>
    """
    if not data: return []
    
    # DEBUG: Ver estructura
    # print("DEBUG Dip Keys:", list(data.keys()))
    
    items = []
    try:
        # Navegar la estructura del XML (puede variar, ajustar según respuesta real)
        # Usualmente: data['Diputados']['Diputado'] es una lista
        # Nota: xmltodict usa diccionarios anidados.
        
        # Ajuste para el endpoint getDiputados_Vigentes
        # La estructura suele ser <Diputados><Diputado>...</Diputado></Diputados>
        # Pero las llaves internas cambiaron
        lista_raw = data.get('Diputados', {}).get('Diputado', [])
        
        if not isinstance(lista_raw, list):
            lista_raw = [lista_raw] 
            
        for d in lista_raw:
            try:
                # DEBUG: Imprimir llaves del primer elemento para ver qué más hay
                if len(items) == 0:
                    print(f"DEBUG: Llaves de diputado: {d.keys()}")

                # Extraer Partido de Militancias_Periodos
                partido = None
                militancias_periodos = d.get('Militancias_Periodos') or {}
                militancias = militancias_periodos.get('Militancia', [])
                if isinstance(militancias, dict): militancias = [militancias]
                
                # Tomar la última militancia (vigente)
                if militancias:
                    partido = militancias[-1].get('Partido')

                item = {
                    "id": int(d.get('DIPID')),
                    "nombre": d.get('Nombre'),
                    "apellido_paterno": d.get('Apellido_Paterno'),
                    "apellido_materno": d.get('Apellido_Materno'),
                    "partido": partido, 
                    "distrito": None, # Distrito no parece venir en este endpoint simple
                    "url_foto": f"http://www.camara.cl/img.aspx?pId={d.get('DIPID')}&pT=1",
                    "updated_at": datetime.now().isoformat()
                }
                items.append(item)
            except Exception as e:
                print(f"Error procesando diputado {d.get('DIPID', 'Unknown')}: {e}")
                import traceback
                traceback.print_exc()
                
    except Exception as e:
        print(f"Error general procesando diputados: {e}")
        # DEBUG: imprimir keys para entender estructura si falla
        print("Keys disponibles:", data.keys())

    return items

def process_votaciones(data):
    """
    Procesa las votaciones.
    """
    if not data: return []
    
    items = []
    try:
        lista_raw = data.get('Votaciones', {}).get('Votacion', [])
        if not isinstance(lista_raw, list):
            lista_raw = [lista_raw]
            
        for v in lista_raw:
            try:
                # Fecha formato: 2025-01-22T10:30:00
                fecha_str = v.get('Fecha')
                
                item = {
                    "id": int(v.get('Id')),
                    "fecha": fecha_str,
                    "materia": v.get('Materia'),
                    "resultado": v.get('Resultado'),
                }
                items.append(item)
            except Exception as e:
                print(f"Error procesando votación {v.get('Id')}: {e}")

    except Exception as e:
        print(f"Error general procesando votaciones: {e}")

    return items

def upload_data(table, items):
    if not items:
        print(f"No hay datos para subir a {table}.")
        return

    print(f"Subiendo {len(items)} registros a '{table}'...")
    
    batch_size = 100
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        try:
            supabase.table(table).upsert(batch, on_conflict='id').execute()
        except Exception as e:
            print(f"Error subiendo lote a {table}: {e}")

def main():
    print("--- Iniciando ETL Cámara de Diputados ---")
    
    # 1. Diputados Actuales
    url_diputados = "https://opendata.camara.cl/wscamaradiputados.asmx/getDiputados_Vigentes"
    raw_diputados = fetch_and_parse(url_diputados)
    if raw_diputados:
        clean_diputados = process_diputados(raw_diputados)
        print(f"DEBUG: Diputados procesados: {len(clean_diputados)}")
        upload_data('diputados', clean_diputados)
        
    # 2. Votaciones 2025 (Comentado por error 500 en API)
    # year = datetime.now().year
    # url_votaciones = f"https://opendata.camara.cl/wscamaradiputados.asmx/getVotaciones_Ano?pAno={year}"
    # raw_votaciones = fetch_and_parse(url_votaciones)
    # if raw_votaciones:
    #     clean_votaciones = process_votaciones(raw_votaciones)
    #     upload_data('votaciones_sala', clean_votaciones)

    print("--- ETL Cámara Finalizado ---")

if __name__ == "__main__":
    main()
