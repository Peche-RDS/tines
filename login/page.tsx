"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthFormInput } from "@/components/auth/auth-form-input"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { validateEmail } from "@/lib/validaciones"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [serverMessage, setServerMessage] = useState<{
    text: string
    type: "success" | "error"
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const emailError = validateEmail(email)
  const passwordError = password.length > 0 && password.length < 8 ? "Mínimo 8 caracteres" : ""
  const hasErrors = !!emailError || !!passwordError || !email || !password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (hasErrors) return

    setIsLoading(true)
    setServerMessage(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
  // 1. Guarda el token como cookie
  document.cookie = `token=${data.token}; path=/; max-age=28800`;

  // 2. Muestra mensaje de bienvenida
  setServerMessage({
    text: "¡Bienvenido! Iniciando sesión...",
    type: "success",
  })

  // 3. Redirige según el rol
  const role = data.user?.role;

  setTimeout(() => {
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else if (role === "user") {
      router.push("/dashboard/user");
    } else {
      router.push("/dashboard");
    }
  }, 1500)
}
      else {
        setServerMessage({
          text: data.message || "Credenciales incorrectas",
          type: "error",
        })
      }
    } catch (error) {
      setServerMessage({
        text: "No se pudo conectar con el servidor. Intenta más tarde.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <AuthCard
        title="Bienvenido de nuevo"
        description="Ingresa tus credenciales para acceder a tu cuenta"
      >
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <FieldGroup>
            <AuthFormInput
              id="email"
              label="Correo electronico"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={email ? emailError : ""}
            />
            <AuthFormInput
              id="password"
              label="Contrasena"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
            />
          </FieldGroup>

          {serverMessage && (
            <div
              className={`rounded-md px-4 py-3 text-sm font-medium ${
                serverMessage.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {serverMessage.text}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={hasErrors || isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesion"}
            </Button>
            <Link
              href="/recuperar"
              className="text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Olvidaste tu contrasena?
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                No tienes cuenta?
              </span>
            </div>
          </div>

          <Link href="/register">
            <Button variant="outline" type="button" className="w-full">
              Crear cuenta
            </Button>
          </Link>
        </form>
      </AuthCard>
    </main>
  )
}