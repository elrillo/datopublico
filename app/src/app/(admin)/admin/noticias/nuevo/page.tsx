import { NewsForm } from "@/components/admin/NewsForm"

export default function NewNewsPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Nueva Noticia</h2>
            </div>
            <div className="grid gap-4 grid-cols-1">
                <NewsForm />
            </div>
        </div>
    )
}
