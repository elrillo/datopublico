import os
import requests
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime
import time

# Cargar variables de entorno
load_dotenv()

# Configuración de Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
MERCADOPUBLICO_TICKET = os.getenv("MERCADOPUBLICO_TICKET")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Faltan las credenciales de Supabase en el archivo .env")

if not MERCADOPUBLICO_TICKET:
    raise ValueError("Falta el Ticket de MercadoPúblico en el archivo .env")

# Inicializar cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_licitaciones(date_str):
    """
    Obtiene Licitaciones para una fecha específica.
    URL: https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json
    """
    url = "https://api.mercadopublico.cl/servicios/v1/publico/licitaciones.json"
    params = {
        "fecha": date_str,
        "ticket": MERCADOPUBLICO_TICKET
    }
    
    print(f"Consultando Licitaciones para fecha: {date_str}...")
    
    max_retries = 3
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            response = requests.get(url, params=params, timeout=60)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Intento {attempt + 1}/{max_retries} fallido: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (attempt + 1))
            else:
                print("Error persistente al conectar con MercadoPúblico.")
                return None

def process_licitaciones(data):
    """
    Procesa el JSON de Licitaciones.
    """
    if not data or 'Listado' not in data:
        print("No se encontraron datos o el formato es incorrecto.")
        return []

    processed_items = []
    
    for item in data['Listado']:
        try:
            # Parsear fechas
            fecha_pub = None
            fecha_cierre = None
            
            if item.get('FechaCreacion'):
                try:
                    fecha_pub = datetime.strptime(item.get('FechaCreacion'), '%Y-%m-%dT%H:%M:%S').isoformat()
                except: pass
            
            if item.get('FechaCierre'):
                try:
                    fecha_cierre = datetime.strptime(item.get('FechaCierre'), '%Y-%m-%dT%H:%M:%S').isoformat()
                except: pass

            codigo = item.get('CodigoExterno')
            if not codigo:
                # Intentar con CodigoExternal por si acaso cambia
                codigo = item.get('CodigoExternal')

            if not codigo:
                # print(f"ALERTA: Licitación sin código encontrada...") # Comentado para reducir ruido
                continue

            processed_item = {
                "codigo": codigo,
                "nombre": item.get('Nombre'),
                "estado": item.get('Estado'),
                "comprador_nombre": item.get('Comprador', {}).get('NombreOrganismo'),
                "comprador_codigo": item.get('Comprador', {}).get('CodigoOrganismo'),
                "fecha_publicacion": fecha_pub,
                "fecha_cierre": fecha_cierre,
                "moneda": item.get('Moneda'),
                "monto_estimado": item.get('MontoEstimado'), 
                "tipo": item.get('Tipo'),
            }
            processed_items.append(processed_item)
        except Exception as e:
            print(f"Error procesando licitación {item.get('CodigoExternal', 'DESCONOCIDO')}: {e}")
            continue
            
    return processed_items

def upload_to_supabase(items):
    if not items:
        print("No hay licitaciones para subir.")
        return

    print(f"Intentando subir {len(items)} licitaciones...")
    
    batch_size = 100
    total_inserted = 0
    
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        try:
            data, count = supabase.table('licitaciones').upsert(batch, on_conflict='codigo').execute()
            if len(data[1]) > 0:
                total_inserted += len(data[1])
                print(f"Lote {i//batch_size + 1}: Procesados {len(data[1])} registros.")
        except Exception as e:
            print(f"Error al subir lote {i//batch_size + 1}: {e}")

    print(f"Proceso finalizado. Total licitaciones procesadas: {total_inserted}")

def main():
    today = datetime.now()
    date_str = today.strftime("%d%m%Y") 
    
    print(f"--- Iniciando ETL Licitaciones ---")
    
    raw_data = fetch_licitaciones(date_str)
    if raw_data:
        clean_data = process_licitaciones(raw_data)
        upload_to_supabase(clean_data)
    else:
        print("No se obtuvieron datos.")

if __name__ == "__main__":
    main()
