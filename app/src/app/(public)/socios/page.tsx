'use client';

import { useActionState } from 'react';
import { registrarMailerLite } from '@/app/actions/mailerlite';
import { Button } from '@/components/ui/Button';
import { Check, Mail, Database, Bell, Lock, Download, Zap, Loader2 } from 'lucide-react';

function SubscriptionForm({ tipo, buttonText }: { tipo: 'gratis' | 'pro', buttonText: string }) {
    const [state, action, isPending] = useActionState(registrarMailerLite, null);

    if (state?.success) {
        return (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center justify-center gap-3 border border-green-200 shadow-inner animate-in fade-in zoom-in duration-300">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-semibold">{state.message || "¡Gracias por registrarte! Te contactaremos pronto."}</span>
            </div>
        );
    }

    return (
        <form action={action} className="space-y-4 animate-in fade-in">
            <input type="hidden" name="tipo" value={tipo} />
            <div className="space-y-2">
                <div className="relative group">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="tu@email.com"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white focus:ring-0 focus:border-primary transition-all outline-none text-slate-900 placeholder:text-slate-400"
                        disabled={isPending}
                    />
                </div>
            </div>
            {state?.error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in">
                    {state.error}
                </div>
            )}
            <Button
                type="submit"
                className={`w-full py-6 text-base md:text-lg rounded-xl font-medium transition-all shadow-sm group ${tipo === 'pro'
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/25 hover:shadow-lg'
                        : 'hover:shadow-md'
                    }`}
                disabled={isPending}
                variant={tipo === 'pro' ? 'default' : 'default'}
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Procesando...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        {buttonText}
                        {tipo === 'pro' && <Zap className="w-4 h-4 group-hover:scale-110 transition-transform text-indigo-300" />}
                    </span>
                )}
            </Button>
        </form>
    );
}

export default function SociosPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-primary/20">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden px-4">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-3xl z-0" />
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] z-0" />
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] z-0" />

                <div className="container max-w-4xl mx-auto relative z-10 text-center">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary mb-8 tracking-tight">
                        <span>🚀 Sé parte de la comunidad</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 font-serif">
                        Datos que dan <span className="text-primary italic">ventaja.</span> <br className="hidden md:block" />
                        Únete a DatoPublico.
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto font-light">
                        Acceso sin límites a inteligencia de compras públicas, bases de datos legislativas y cruces de financiamiento político.
                    </p>
                </div>
            </section>

            {/* Pricing / Access Plans Section */}
            <section className="pb-24 px-4 relative z-10">
                <div className="container max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-stretch">

                        {/* Plan Gratis */}
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col relative overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20" />

                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Newsletter Semanal</h2>
                                <p className="text-slate-500 text-lg">Perfecto para mantenerse informado sobre la actualidad pública y legislativa.</p>
                            </div>

                            <div className="space-y-6 mb-10 flex-grow">
                                <ul className="space-y-5">
                                    <li className="flex items-start gap-3.5">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-slate-700 leading-tight md:text-lg">Resumen exclusivo de <strong>"La Compra del Mes"</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3.5">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-slate-700 leading-tight md:text-lg">Análisis detallado de <strong>leyes clave</strong> en tramitación</span>
                                    </li>
                                    <li className="flex items-start gap-3.5">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                                            <Check className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-slate-700 leading-tight md:text-lg">Noticias y actualizaciones de nuestra plataforma</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-auto bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <SubscriptionForm tipo="gratis" buttonText="Suscribirse gratis" />
                            </div>
                        </div>

                        {/* Plan Pro */}
                        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-2xl flex flex-col relative overflow-hidden transition-all hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.5)] hover:-translate-y-1 duration-300">
                            {/* Pro glow effects */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px]" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />

                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                            <div className="mb-8 relative z-10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                                        DatoPublico Pro
                                    </h2>
                                    <span className="px-3.5 py-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 font-mono tracking-wider w-fit">
                                        PRÓXIMAMENTE
                                    </span>
                                </div>
                                <p className="text-slate-400 text-lg">Inteligencia de datos avanzada para investigadores, empresas y analistas.</p>
                            </div>

                            <div className="space-y-6 mb-10 flex-grow relative z-10">
                                <ul className="space-y-5">
                                    <li className="flex items-start gap-3.5">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5 border border-indigo-500/30">
                                            <Download className="w-3.5 h-3.5 text-indigo-300" />
                                        </div>
                                        <span className="text-slate-200 leading-tight md:text-lg">Descarga directa de datos procesados en <strong>CSV/Excel</strong></span>
                                    </li>
                                    <li className="flex items-start gap-3.5">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5 border border-indigo-500/30">
                                            <Bell className="w-3.5 h-3.5 text-indigo-300" />
                                        </div>
                                        <span className="text-slate-200 leading-tight md:text-lg"><strong>Alertas tempranas</strong> de licitaciones personalizadas</span>
                                    </li>
                                    <li className="flex items-start gap-3.5">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5 border border-indigo-500/30">
                                            <Database className="w-3.5 h-3.5 text-indigo-300" />
                                        </div>
                                        <span className="text-slate-200 leading-tight md:text-lg">Acceso al <strong>histórico completo</strong> sin límites de tiempo</span>
                                    </li>
                                    <li className="flex items-start gap-3.5">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mt-0.5 border border-indigo-500/30 opacity-70">
                                            <Lock className="w-3.5 h-3.5 text-indigo-300" />
                                        </div>
                                        <span className="text-slate-400 leading-tight md:text-lg">Cruces de información exclusivos y APIs (Pronto)</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-auto relative z-10 bg-slate-800/60 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm">
                                <p className="text-sm text-indigo-200 mb-4 text-center font-medium">Asegura tu lugar en la beta cerrada</p>
                                <SubscriptionForm tipo="pro" buttonText="Unirme a la lista de espera" />
                            </div>
                        </div>

                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center justify-center gap-2 bg-white/60 px-6 py-3 rounded-full border border-slate-200 shadow-sm text-slate-500 text-sm backdrop-blur-sm">
                            <Lock className="w-4 h-4" /> Tus datos están seguros. Nunca enviaremos correos no deseados.
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
