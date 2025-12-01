import subprocess
import time
import sys

def run_script(script_name):
    print(f"--- Ejecutando {script_name} ---")
    try:
        result = subprocess.run([sys.executable, script_name], check=True)
        print(f"--- {script_name} finalizado correctamente ---\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"--- Error al ejecutar {script_name}: {e} ---\n")
        return False

def main():
    print("Iniciando Orquestador de Mercado Público...\n")
    
    scripts = [
        "etl_licitaciones.py",
        "etl_mercadopublico.py"
    ]
    
    for script in scripts:
        success = run_script(script)
        if success:
            print("Esperando 10 segundos antes del siguiente script...")
            time.sleep(10)
            
    print("Orquestación MP finalizada.")

if __name__ == "__main__":
    main()
