"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthFormInput } from "@/components/auth/auth-form-input";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/lib/validaciones";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [serverMessage, setServerMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Validación en tiempo real
  useEffect(() => {
    setErrors({
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    });
  }, [name, email, password, confirmPassword]);

  const hasErrors = Object.values(errors).some((e) => e !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasErrors) return;

    setIsLoading(true);
    setServerMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setServerMessage({
          text: "Registro exitoso. Por favor inicia sesión.",
          type: "success",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setServerMessage({
          text: data.message || data.detail || "Error al registrar. Intenta de nuevo.",
          type: "error",
        });
      }
    } catch (error) {
      setServerMessage({
        text: "No se pudo conectar con el servidor. Intenta más tarde.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <AuthCard
        title="Crear cuenta"
        description="Completa tus datos para registrarte"
      >
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <FieldGroup>
            <AuthFormInput
              id="name"
              label="Nombre completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <AuthFormInput
              id="email"
              label="Correo electronico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <AuthFormInput
              id="password"
              label="Contrasena"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <AuthFormInput
              id="confirmPassword"
              label="Confirmar contrasena"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
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
              {serverMessage.type === "success" && (
                <p className="text-xs mt-1 text-green-600">
                  Redirigiendo al login en 3 segundos...
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={hasErrors || isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ya tienes cuenta?
              </span>
            </div>
          </div>

          <Link href="/login">
            <Button variant="outline" type="button" className="w-full">
              Ya tengo cuenta
            </Button>
          </Link>
        </form>
      </AuthCard>
    </main>
  );
}