'use server'

import { createClient } from "@supabase/supabase-js"


export async function createNewUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as string
    const membershipExpiresAt = formData.get('membership_expires_at') as string

    if (!email || !password) {
        return { error: 'Email y contraseña son requeridos' }
    }

    // Initialize Supabase Admin client
    // Note: This requires SUPABASE_SERVICE_ROLE_KEY in .env.local
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: fullName
        }
    })

    if (authError) {
        return { error: authError.message }
    }

    if (!authData.user) {
        return { error: 'No se pudo crear el usuario' }
    }

    // 2. Update profile role and expiration
    const updates: any = {}
    if (role && role !== 'user') updates.role = role
    if (membershipExpiresAt) updates.membership_expires_at = membershipExpiresAt

    if (Object.keys(updates).length > 0) {
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update(updates)
            .eq('id', authData.user.id)

        if (profileError) {
            return { error: 'Usuario creado pero falló la actualización de perfil: ' + profileError.message }
        }
    }

    return { success: true }
}
