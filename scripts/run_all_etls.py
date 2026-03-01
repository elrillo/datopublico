import subprocess
import time
import sys
import os

def run_script(script_name):
    print(f"--- Ejecutando {script_name} ---")
    try:
        # Ejecutar el script y esperar a que termine
        result = subprocess.run([sys.executable, script_name], check=True)
        print(f"--- {script_name} finalizado correctamente ---\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"--- Error al ejecutar {script_name}: {e} ---\n")
        return False

def main():
    print("Iniciando Orquestador de ETLs...\n")
    
    # Obtener el directorio donde reside este script (run_all_etls.py)
    base_dir = os.path.dirname(os.path.abspath(__file__))

    scripts = [
        os.path.join(base_dir, "etl_discovery.py"),
        os.path.join(base_dir, "etl_proyectos.py"),
        os.path.join(base_dir, "etl_diputados.py"),
        os.path.join(base_dir, "etl_senado.py"),
        os.path.join(base_dir, "etl_historical_details.py"), # Votaciones Cámara Detalle
        os.path.join(base_dir, "etl_senado_details.py")      # Votaciones Senado Detalle
    ]
    
    for script in scripts:
        success = run_script(script)
        if success:
            # Esperar un poco entre scripts para no saturar la API o la DB
            print("Esperando 10 segundos antes del siguiente script...")
            time.sleep(10)
        else:
            print("Deteniendo ejecución por error en script anterior (opcional).")
            # Podríamos continuar con 'continue' si queremos que los fallos no bloqueen todo
            
    print("Orquestación finalizada.")

if __name__ == "__main__":
    main()
