export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            noticias: {
                Row: {
                    id: string
                    created_at: string
                    title: string
                    slug: string
                    content: string | null
                    published_at: string | null
                    image_url: string | null
                    is_published: boolean | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    title: string
                    slug: string
                    content?: string | null
                    published_at?: string | null
                    image_url?: string | null
                    is_published?: boolean | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    title?: string
                    slug?: string
                    content?: string | null
                    published_at?: string | null
                    image_url?: string | null
                    is_published?: boolean | null
                }
                Relationships: []
            }
            datos_mercadopublico: {
                Row: {
                    id: string
                    fecha: string
                    organismo: string | null
                    monto: number | null
                    tipo: string | null
                    descripcion: string | null
                    sector: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    fecha: string
                    organismo?: string | null
                    monto?: number | null
                    tipo?: string | null
                    descripcion?: string | null
                    sector?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    fecha?: string
                    organismo?: string | null
                    monto?: number | null
                    tipo?: string | null
                    descripcion?: string | null
                    sector?: string | null
                    created_at?: string
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
