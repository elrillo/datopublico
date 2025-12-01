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

def fetch_and_parse(url):
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
            return xmltodict.parse(response.content)
        except Exception as e:
            print(f"Intento {attempt + 1}/{max_retries} fallido: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (attempt + 1))
            else:
                print("Error persistente al conectar con API Senado.")
                return None

def process_proyectos(data):
    """
    Procesa la lista de proyectos (boletines) desde la tramitación del Senado.
    """
    if not data: return []
    
    items = []
    try:
        # Estructura: <proyectos><proyecto>...</proyecto></proyectos>
        lista_raw = data.get('proyectos', {}).get('proyecto', [])
        
        if not isinstance(lista_raw, list):
            lista_raw = [lista_raw]
            
        for p in lista_raw:
            try:
                # Extraer datos básicos
                boletin = p.get('descripcion', {}).get('boletin')
                if not boletin: continue

                # Parsear fecha DD/MM/YYYY a YYYY-MM-DD
                fecha_raw = p.get('descripcion', {}).get('fecha_ingreso')
                fecha_iso = None
                if fecha_raw:
                    try:
                        fecha_iso = datetime.strptime(fecha_raw, "%d/%m/%Y").date().isoformat()
                    except ValueError:
                        print(f"Advertencia: Fecha inválida {fecha_raw} en boletín {boletin}")

                item = {
                    "boletin": boletin,
                    "titulo": p.get('descripcion', {}).get('titulo'),
                    "fecha_ingreso": fecha_iso,
                    "iniciativa": p.get('descripcion', {}).get('iniciativa'),
                    "camara_origen": p.get('descripcion', {}).get('camara_origen'),
                    "urgencia_actual": p.get('descripcion', {}).get('urgencia_actual'),
                    "etapa": p.get('descripcion', {}).get('etapa'),
                    "link_tramitacion": p.get('descripcion', {}).get('link_mensaje_mocion'),
                    "updated_at": datetime.now().isoformat()
                }
                items.append(item)
            except Exception as e:
                print(f"Error procesando proyecto {p.get('descripcion', {}).get('boletin', 'Unknown')}: {e}")
                
    except Exception as e:
        print(f"Error general procesando proyectos: {e}")

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
            supabase.table(table).upsert(batch, on_conflict='boletin').execute()
        except Exception as e:
            print(f"Error subiendo lote a {table}: {e}")

def main():
    print("--- Iniciando ETL Proyectos de Ley (Boletines) ---")
    
    # 1. Obtener boletines pendientes de actualizar desde Supabase
    # (Por ahora traemos todos, o podríamos filtrar los que tienen updated_at antiguo)
    try:
        response = supabase.table('proyectos_ley').select('boletin').execute()
        boletines_db = [item['boletin'] for item in response.data]
    except Exception as e:
        print(f"Error obteniendo boletines de DB: {e}")
        boletines_db = []

    # Agregar boletines de prueba si la DB está vacía
    if not boletines_db:
        boletines_db = ["8575-07", "16197-07"]
    
    print(f"Procesando {len(boletines_db)} boletines...")
    
    for boletin_id in boletines_db:
        # Limpiar el guión si la API lo requiere sin guión (a veces pasa)
        clean_id = boletin_id.split('-')[0]
        url = f"https://tramitacion.senado.cl/wspublico/tramitacion.php?boletin={clean_id}"
        
        raw_data = fetch_and_parse(url)
        if raw_data:
            clean_proyectos = process_proyectos(raw_data)
            upload_data('proyectos_ley', clean_proyectos)
            
        time.sleep(0.5) # Rate limit
            
    print("--- ETL Proyectos Finalizado ---")

if __name__ == "__main__":
    main()
