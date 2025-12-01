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

    // 3. Log audit
    // Since this is a server action, we need to get the current admin user ID
    // However, createClient with service role doesn't have a current user session.
    // We might need to pass the admin ID or just log as 'system' or skip user_id check if RLS allows.
    // For now, let's skip audit log here or we'd need to pass the actor's ID from the client.
    // Alternatively, we can assume the caller is authorized and we just log the event if we had the actor ID.

    // Let's try to get the user from the standard client in the component, but here we are in a server action.
    // We will skip audit log inside this function to avoid complexity, 
    // but we should log it in the client component after success if possible, 
    // OR we can fetch the current user if we use a cookie-based client here instead of admin client for the actor.

    // Better approach: Return the new user ID so the client can log it.
    return { success: true, userId: authData.user.id }
}
