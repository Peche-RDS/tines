"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";

interface AuthFormInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;

  // 🔥 NUEVO
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      // Guarda el token (ajusta según tu estrategia)
      localStorage.setItem("token", data.token);

      // Redirige según el rol
      const role = data.user?.role;

      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "user") {
        router.push("/dashboard/user");
      } else {
        router.push("/dashboard"); // fallback
      }

    } catch (err: any) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}

// Campo de formulario reutilizable para autenticacion
export function AuthFormInput({
  id,
  label,
  type = "text",
  placeholder,
  required = true,
  autoComplete,
  value,
  onChange,
  error,
}: AuthFormInputProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className={`h-11 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
      />

      {/* 🔴 MENSAJE DE ERROR */}
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </Field>
  );
}
