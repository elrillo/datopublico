import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card"
import { Calendar, ArrowRight } from "lucide-react"

interface NewsCardProps {
    title: string
    excerpt: string
    date: string
    imageUrl?: string
    slug: string
    category?: string
}

export function NewsCard({ title, excerpt, date, imageUrl, slug, category = "General" }: NewsCardProps) {
    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300 group">
            <div className="aspect-video w-full bg-muted relative overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                        <span className="text-4xl">📰</span>
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-primary/90 text-primary-foreground rounded-full backdrop-blur-sm">
                        {category}
                    </span>
                </div>
            </div>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3 h-3" />
                    {date}
                </div>
                <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">
                    <Link href={`/noticias/${slug}`}>
                        {title}
                    </Link>
                </h3>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <p className="text-muted-foreground text-sm line-clamp-3">
                    {excerpt}
                </p>
            </CardContent>
            <CardFooter className="pt-0">
                <Link
                    href={`/noticias/${slug}`}
                    className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all"
                >
                    Leer más <ArrowRight className="w-4 h-4" />
                </Link>
            </CardFooter>
        </Card>
    )
}
