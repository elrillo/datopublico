import { createClient } from "@/lib/supabase/server";
import { ComprasDashboard, OrdenCompra } from "@/components/visualizations/ComprasDashboard";

export const revalidate = 3600; // Revalidate every hour

export default async function ComprasPage() {
    const supabase = await createClient();

    // Fetch data
    const { data, error } = await supabase
        .from('datos_mercadopublico')
        .select('*')
        .order('fecha', { ascending: false })
        .limit(2000);

    if (error) {
        console.error("Error fetching compras:", error);
        return (
            <div className="container mx-auto py-8 text-center">
                <h1 className="text-2xl font-bold text-red-500">Error al cargar datos</h1>
                <p className="text-muted-foreground">No se pudieron obtener los datos de MercadoPúblico.</p>
                <pre className="mt-4 p-4 bg-gray-100 rounded text-left text-xs overflow-auto max-w-lg mx-auto">
                    {JSON.stringify(error, null, 2)}
                </pre>
            </div>
        );
    }

    // Cast data to OrdenCompra[]
    // We map the database fields to our interface if they differ, but they seem to match based on ETL
    const compras = (data || []).map((item: any) => ({
        codigo: item.codigo,
        fecha: item.fecha,
        organismo: item.organismo,
        monto: item.monto,
        moneda: item.moneda,
        estado: item.estado,
        tipo: item.tipo,
        descripcion: item.descripcion,
        sector: item.sector,
        proveedor_rut: item.proveedor_rut,
        proveedor_nombre: item.proveedor_nombre
    })) as OrdenCompra[];

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Visualizador de Compras Públicas</h1>
                <p className="text-muted-foreground mt-2">
                    Explora las últimas órdenes de compra y su distribución por sector y organismo.
                </p>
            </div>

            <ComprasDashboard initialData={compras} />
        </div>
    );
}
