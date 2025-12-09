import subprocess
import time
import sys

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
    
    scripts = [
        "etl_discovery.py",
        "etl_proyectos.py",
        "etl_diputados.py",
        "etl_senado.py",
        "etl_historical_details.py", # Votaciones Cámara Detalle
        "etl_senado_details.py"      # Votaciones Senado Detalle
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
