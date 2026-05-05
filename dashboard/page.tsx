"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // El token JWT tiene 3 partes separadas por "."
      // La del medio es el payload en base64
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "user") {
        router.push("/dashboard/user");
      } else {
        router.push("/login"); // rol desconocido
      }
    } catch {
      router.push("/login"); // token malformado
    }
  }, []);

  return <p>Redirigiendo...</p>;
}