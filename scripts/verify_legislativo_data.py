import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar variables de entorno desde el directorio raíz
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(dotenv_path=env_path)

# Configuración de Supabase (Proyecto Legislativo)
SUPABASE_URL = os.getenv("LEGISLATIVO_URL")
SUPABASE_KEY = os.getenv("LEGISLATIVO_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: No se encontraron las credenciales LEGISLATIVO_URL / LEGISLATIVO_SERVICE_ROLE_KEY")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def count_rows(table):
    try:
        # head=True para solo obtener count, count='exact' para exactitud
        response = supabase.table(table).select("*", count='exact').limit(1).execute()
        return response.count
    except Exception as e:
        print(f"Error consultando {table}: {e}")
        return "Error"

def main():
    print(f"--- Verificando Datos en Proyecto Legislativo ({SUPABASE_URL}) ---")
    
    tables = [
        "proyectos_ley",
        "diputados",
        "senadores",
        "votaciones_sala",
        "fact_votaciones_detalle",
        "sesiones"
    ]
    
    print(f"{'TABLA':<30} | {'REGISTROS':<10}")
    print("-" * 45)
    
    for table in tables:
        count = count_rows(table)
        print(f"{table:<30} | {count:<10}")

    print("\nVerificación completa.")

if __name__ == "__main__":
    main()
