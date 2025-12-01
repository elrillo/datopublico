import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Database, FileCode, Server, Shield } from "lucide-react"

export default function MetodologiaPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Metodología y Fuentes de Datos</h1>
                <p className="text-xl text-muted-foreground">
                    Transparencia total sobre cómo obtenemos, procesamos y visualizamos la información pública.
                </p>
            </div>

            <div className="grid gap-8">
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Database className="w-6 h-6 text-primary" />
                        Fuentes de Información
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">MercadoPúblico (API)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Conectamos directamente con la API de MercadoPúblico para obtener datos en tiempo real sobre licitaciones, órdenes de compra y tratos directos de todos los organismos del Estado.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Datos Abiertos (CKAN)</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Descargamos y procesamos datasets históricos disponibles en los portales de datos abiertos del Gobierno para análisis de tendencias a largo plazo.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Superintendencia de Salud</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Cruzamos información de prestadores de salud y precios referenciales para detectar anomalías en las compras del sector sanitario.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">MINEDUC</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                Utilizamos los registros de subvenciones escolares y matrícula para contextualizar el gasto en educación pública.
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Server className="w-6 h-6 text-primary" />
                        Procesamiento de Datos (ETL)
                    </h2>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p>
                            Nuestro pipeline de datos (Extract, Transform, Load) ejecuta procesos diarios para asegurar la calidad de la información:
                        </p>
                        <ul>
                            <li>
                                <strong>Extracción:</strong> Scripts automatizados consultan las fuentes oficiales cada 24 horas.
                            </li>
                            <li>
                                <strong>Normalización:</strong> Unificamos nombres de proveedores y organismos que suelen aparecer con distintas grafías (ej: "Muni. Santiago" vs "I. Municipalidad de Santiago").
                            </li>
                            <li>
                                <strong>Enriquecimiento:</strong> Agregamos metadatos adicionales, como clasificación por rubro (Salud, Obras, Tecnología) utilizando algoritmos de procesamiento de texto.
                            </li>
                            <li>
                                <strong>Carga:</strong> Los datos limpios se almacenan en nuestra base de datos segura para ser consultados por la plataforma web.
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        Privacidad y Seguridad
                    </h2>
                    <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                            <p className="text-muted-foreground">
                                DatoPúblico.cl solo trabaja con información de carácter público según la Ley de Transparencia (Ley 20.285). No almacenamos ni publicamos datos personales sensibles de ciudadanos particulares, salvo aquellos que sean proveedores del Estado y cuya información sea pública por ley.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <FileCode className="w-6 h-6 text-primary" />
                        Código Abierto
                    </h2>
                    <p className="text-muted-foreground">
                        Creemos que la herramienta para fiscalizar también debe ser transparente. Parte de nuestro código, especialmente los scripts de procesamiento de datos, estará disponible próximamente en nuestro repositorio de GitHub para auditoría comunitaria.
                    </p>
                </section>
            </div>
        </div>
    )
}
