import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

export const createLegislativoClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_LEGISLATIVO_URL!,
        process.env.NEXT_PUBLIC_LEGISLATIVO_ANON_KEY!
    )
