import os
import requests
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta
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

def fetch_ordenes_compra(date_str):
    """
    Obtiene Órdenes de Compra para una fecha específica.
    URL: https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json
    Parámetros: fecha (ddmmaaaa), ticket
    """
    url = "https://api.mercadopublico.cl/servicios/v1/publico/ordenesdecompra.json"
    params = {
        "fecha": date_str,
        "ticket": MERCADOPUBLICO_TICKET
    }
    
    print(f"Consultando API para fecha: {date_str}...")
    
    max_retries = 3
    retry_delay = 5 # segundos
    
    for attempt in range(max_retries):
        try:
            response = requests.get(url, params=params, timeout=60) # Aumentado a 60s
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Intento {attempt + 1}/{max_retries} fallido: {e}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (attempt + 1)) # Backoff lineal/exponencial simple
            else:
                print("Error persistente al conectar con MercadoPúblico.")
                return None

def process_ordenes(data):
    """
    Procesa el JSON de Órdenes de Compra.
    Estructura esperada:
    {
        "Cantidad": 100,
        "FechaCreacion": "...",
        "Listado": [
            {
                "Codigo": "...",
                "Nombre": "...",
                "Estado": "...",
                "Comprador": { "NombreOrganismo": "...", "Sector": "..." },
                "MontoTotal": 1000,
                "TipoMoneda": "CLP",
                "FechaCreacion": "..."
            }, ...
        ]
    }
    """
    if not data or 'Listado' not in data:
        print("No se encontraron datos o el formato es incorrecto.")
        return []

    processed_items = []
    
    for item in data['Listado']:
        try:
            # Parsear fecha. Formato usual API: "2023-11-25T14:30:00"
            fecha_str = item.get('FechaCreacion', '')
            fecha_obj = None
            
            if fecha_str:
                try:
                    # Intentar parsear formato ISO
                    fecha_obj = datetime.strptime(fecha_str, '%Y-%m-%dT%H:%M:%S').isoformat()
                except ValueError:
                    pass
            
            # Si falla el parseo o no hay fecha, usar fecha actual
            if not fecha_obj:
                fecha_obj = datetime.now().isoformat()

            processed_item = {
                "codigo": item.get('Codigo'),
                "fecha": fecha_obj,
                "organismo": item.get('Comprador', {}).get('NombreOrganismo'),
                "monto": item.get('MontoTotal'),
                "moneda": item.get('TipoMoneda'),
                "estado": item.get('Estado'),
                "tipo": "Orden de Compra",
                "descripcion": item.get('Nombre'),
                "sector": item.get('Comprador', {}).get('Sector', 'Sin Clasificar'),
                "proveedor_rut": item.get('Proveedor', {}).get('RutSucursal'),
                "proveedor_nombre": item.get('Proveedor', {}).get('Nombre'),
            }
            processed_items.append(processed_item)
        except Exception as e:
            print(f"Error procesando item {item.get('Codigo', 'DESCONOCIDO')}: {e}")
            continue
            
    return processed_items

def upload_to_supabase(items):
    """
    Sube los datos a Supabase usando UPSERT (insertar o actualizar si existe).
    Requiere que la columna 'codigo' tenga constraint UNIQUE en la DB.
    """
    if not items:
        print("No hay datos para subir.")
        return

    print(f"Intentando subir {len(items)} registros...")
    
    # Subir en lotes para no saturar la petición
    batch_size = 100
    total_inserted = 0
    
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        try:
            # upsert=True es el comportamiento por defecto si se especifica on_conflict?
            # En la librería de Python supabase-js-like, .upsert() es el método.
            data, count = supabase.table('datos_mercadopublico').upsert(batch, on_conflict='codigo').execute()
            
            # Verificar respuesta (la estructura de respuesta puede variar según versión)
            if len(data[1]) > 0:
                total_inserted += len(data[1])
                print(f"Lote {i//batch_size + 1}: Procesados {len(data[1])} registros.")
        except Exception as e:
            print(f"Error al subir lote {i//batch_size + 1}: {e}")

    print(f"Proceso finalizado. Total registros procesados: {total_inserted}")

def upload_proveedores(items):
    """
    Extrae y sube proveedores únicos a la tabla 'proveedores'.
    """
    proveedores = {}
    for item in items:
        rut = item.get('proveedor_rut')
        nombre = item.get('proveedor_nombre')
        # Solo agregar si tenemos RUT
        if rut and rut not in proveedores:
            proveedores[rut] = {"rut": rut, "nombre": nombre}
    
    if not proveedores:
        return

    print(f"Identificados {len(proveedores)} proveedores únicos. Actualizando tabla de proveedores...")
    batch_list = list(proveedores.values())
    
    # Upsert en lotes
    batch_size = 500
    for i in range(0, len(batch_list), batch_size):
        batch = batch_list[i:i + batch_size]
        try:
            supabase.table('proveedores').upsert(batch, on_conflict='rut').execute()
        except Exception as e:
            print(f"Error subiendo lote de proveedores: {e}")

def main():
    # Por defecto hoy.
    today = datetime.now()
    date_str = today.strftime("%d%m%Y") 
    
    print(f"--- Iniciando ETL MercadoPúblico (Órdenes de Compra) ---")
    
    raw_data = fetch_ordenes_compra(date_str)
    if raw_data:
        clean_data = process_ordenes(raw_data)
        upload_to_supabase(clean_data)
        upload_proveedores(clean_data)
    else:
        print("No se obtuvieron datos para procesar.")

if __name__ == "__main__":
    main()
