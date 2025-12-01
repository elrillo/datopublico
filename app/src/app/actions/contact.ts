'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitContactMessage(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !subject || !message) {
        return { error: "Todos los campos son obligatorios" }
    }

    const { error } = await supabase
        .from('contact_messages')
        .insert({
            name,
            email,
            subject,
            message
        })

    if (error) {
        console.error("Error submitting contact form:", error)
        return { error: "Error al enviar el mensaje. Inténtalo de nuevo." }
    }

    // revalidatePath('/admin/mensajes') 
    return { success: "Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto." }
}
