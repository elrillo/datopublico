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

def process_senadores(data):
    if not data: return []
    
    items = []
    try:
        # Estructura: <senadores><senador>...</senador></senadores>
        lista_raw = data.get('senadores', {}).get('senador', [])
        
        if not isinstance(lista_raw, list):
            lista_raw = [lista_raw]
            
        for s in lista_raw:
            try:
                item = {
                    "id": int(s.get('PARLID')),
                    "nombre": s.get('PARLNOMBRE'),
                    "apellido_paterno": s.get('PARLAPELLIDOPATERNO'),
                    "apellido_materno": s.get('PARLAPELLIDOMATERNO'),
                    "partido": s.get('PARTIDO'),
                    "region": s.get('REGION'),
                    "circunscripcion": s.get('CIRCUNSCRIPCION'),
                    "email": s.get('EMAIL'),
                    "telefono": s.get('FONO'),
                    "url_foto": s.get('FOTO'), # A veces viene, si no, inferir
                    "updated_at": datetime.now().isoformat()
                }
                items.append(item)
            except Exception as e:
                print(f"Error procesando senador {s.get('PARLID', 'Unknown')}: {e}")
                
    except Exception as e:
        print(f"Error general procesando senadores: {e}")

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
    print("--- Iniciando ETL Senado ---")
    
    # 1. Senadores Vigentes
    url_senadores = "https://tramitacion.senado.cl/wspublico/senadores_vigentes.php"
    raw_senadores = fetch_and_parse(url_senadores)
    if raw_senadores:
        clean_senadores = process_senadores(raw_senadores)
        upload_data('senadores', clean_senadores)
        
    print("--- ETL Senado Finalizado ---")

if __name__ == "__main__":
    main()
