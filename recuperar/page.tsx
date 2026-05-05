import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthFormInput } from "@/components/auth/auth-form-input"
import { Button } from "@/components/ui/button"

// Pagina de recuperacion de contrasena - Ruta: /recuperar
export default function RecuperarPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <AuthCard
        title="Recuperar contrasena"
        description="Ingresa tu correo y te enviaremos un enlace para restablecer tu contrasena"
      >
        <form className="flex flex-col gap-6">
          <AuthFormInput
            id="email"
            label="Correo electronico"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
          />

          <Button type="submit" size="lg" className="w-full">
            Enviar enlace de recuperacion
          </Button>

          <Link href="/login">
            <Button variant="ghost" type="button" className="w-full">
              Volver al inicio de sesion
            </Button>
          </Link>
        </form>
      </AuthCard>
    </main>
  )
}
