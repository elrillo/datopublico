import { createClient } from "@/lib/supabase/server";
import { ComprasDashboard, OrdenCompra } from "@/components/visualizations/ComprasDashboard";

export const revalidate = 3600;

export default async function EducacionPage() {
    const supabase = await createClient();

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
            </div>
        );
    }

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
                <h1 className="text-3xl font-bold tracking-tight">Datos de Educación</h1>
                <p className="text-muted-foreground mt-2">
                    Visualización de compras públicas en el sector Educación.
                </p>
            </div>

            <ComprasDashboard initialData={compras} defaultSector="Educación" />
        </div>
    );
}
