"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.role !== "admin") {
        router.push("/dashboard/user");
        return;
      }
      setUserName(payload.name || payload.email || "Admin");
    } catch {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div>
      <h1>Bienvenido, {userName}</h1>
      <p>Panel de administración</p>

      {/* Aquí van tus secciones de admin */}

      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}