import requests
import xmltodict
import json
import time

urls = [
    ("Senado - Senadores Vigentes", "https://tramitacion.senado.cl/wspublico/senadores_vigentes.php"),
    ("Camara - Periodos Legislativos", "https://opendata.camara.cl/wscamaradiputados.asmx/getPeriodosLegislativos"),
    ("Camara - Diputados Periodo 6", "https://opendata.camara.cl/wscamaradiputados.asmx/getDiputados_Periodo?prmPeriodoID=6"),
    ("Camara - Legislatura Actual", "https://opendata.camara.cl/wscamaradiputados.asmx/getLegislaturaActual"),
    ("Camara - Legislaturas", "https://opendata.camara.cl/wscamaradiputados.asmx/getLegislaturas"),
    ("Camara - Votacion Detalle 16197", "https://opendata.camara.cl/wscamaradiputados.asmx/getVotacion_Detalle?prmVotacionID=16197"),
    ("Camara - Votaciones Boletin 8575", "https://opendata.camara.cl/wscamaradiputados.asmx/getVotaciones_Boletin?prmBoletin=8575"),
    ("Senado - Votaciones Boletin 8575", "https://tramitacion.senado.cl/wspublico/votaciones.php?boletin=8575"),
    ("Senado - Tramitacion Boletin 8575", "https://tramitacion.senado.cl/wspublico/tramitacion.php?boletin=8575"),
    ("Senado - Sesiones Legislatura 356", "https://tramitacion.senado.cl/wspublico/sesiones.php?legislatura=356"),
    ("Senado - Diario Sesion 5794", "https://tramitacion.senado.cl/wspublico/diariosesion.php?idsesion=5794"),
    ("Senado - Comisiones", "https://tramitacion.senado.cl/wspublico/comisiones.php"),
    ("Camara - Sesiones Legislatura 46", "https://opendata.camara.cl/wscamaradiputados.asmx/getSesiones?prmLegislaturaID=46"),
    ("Camara - Sesion Detalle 3162", "https://opendata.camara.cl/wscamaradiputados.asmx/getSesionDetalle?prmSesionID=3162"),
    ("Camara - Sesion Boletin XML 3162", "https://opendata.camara.cl/wscamaradiputados.asmx/getSesionBoletinXML?prmSesionID=3162"),
    ("Camara - Comisiones Vigentes", "https://opendata.camara.cl/wscamaradiputados.asmx/getComisiones_Vigentes")
]

def analyze_structure(data, name):
    print(f"\n--- {name} ---")
    try:
        if isinstance(data, dict):
            keys = list(data.keys())
            print(f"Raíz Keys: {keys}")
            # Intentar profundizar un nivel si hay una sola llave (común en XML wrappers)
            if len(keys) == 1:
                sub_data = data[keys[0]]
                if isinstance(sub_data, dict):
                    print(f"Nivel 2 Keys ({keys[0]}): {list(sub_data.keys())}")
                    # Buscar listas
                    for k, v in sub_data.items():
                        if isinstance(v, list):
                            print(f"  Lista encontrada en '{k}' con {len(v)} elementos.")
                            if len(v) > 0 and isinstance(v[0], dict):
                                print(f"    Ejemplo Item Keys: {list(v[0].keys())}")
                        elif isinstance(v, dict):
                             print(f"  Diccionario encontrado en '{k}': {list(v.keys())}")
        elif isinstance(data, list):
            print(f"Raíz es Lista con {len(data)} elementos.")
            if len(data) > 0 and isinstance(data[0], dict):
                print(f"  Ejemplo Item Keys: {list(data[0].keys())}")
    except Exception as e:
        print(f"Error analizando estructura: {e}")

def main():
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for name, url in urls:
        try:
            print(f"Consultando: {url}")
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            content_type = response.headers.get('Content-Type', '')
            
            data = None
            if 'xml' in content_type or url.endswith('.asmx') or 'wspublico' in url:
                try:
                    data = xmltodict.parse(response.content)
                except:
                    print("  No se pudo parsear como XML.")
            
            if data is None:
                try:
                    data = response.json()
                except:
                    pass
            
            if data:
                analyze_structure(data, name)
            else:
                print("  No se pudo parsear la respuesta (ni XML ni JSON).")
                print(f"  Inicio respuesta: {response.text[:200]}")
                
            time.sleep(1) # Respetar API
            
        except Exception as e:
            print(f"Error en {name}: {e}")

if __name__ == "__main__":
    main()
