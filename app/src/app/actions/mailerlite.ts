'use server';

export async function registrarMailerLite(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const tipo = formData.get('tipo') as string;

    if (!email || !tipo) {
        return { error: 'Faltan campos requeridos.' };
    }

    try {
        const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
            },
            body: JSON.stringify({
                email: email,
                fields: {
                    tipo_suscripcion: tipo,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('MailerLite Error:', errorData);
            return { error: 'Hubo un problema al registrar la suscripción. Inténtalo más tarde.' };
        }

        return { success: true, message: '¡Gracias por unirte!' };
    } catch (error) {
        console.error('Error enviando a MailerLite:', error);
        return { error: 'Error de conexión. Verifica tu internet e inténtalo nuevamente.' };
    }
}
