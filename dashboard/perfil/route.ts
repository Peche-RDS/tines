import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/authMiddleware";
import { db } from "@/lib/db";

// 👇 ADMIN y USER pueden acceder
export const GET = withAuth(
  async (req: NextRequest, user) => {

    // 🔍 Buscar el usuario autenticado
    const perfil = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!perfil) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(perfil);

  },
  ["admin", "user"] // 👈 ambos roles pueden entrar
);