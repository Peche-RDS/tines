import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type UserToken = {
  id: string;
  email: string;
  role: string;
};

export function withAuth(
  handler: (req: NextRequest, user: UserToken) => Promise<NextResponse>,
  allowedRoles: string[] = []
) {
  return async (req: NextRequest) => {
    try {
      //  Obtener token desde cookies (tu caso)
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json(
          { message: "No autenticado" },
          { status: 401 }
        );
      }

      // Verificar token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secreto_temporal"
      ) as UserToken;

      //  Validar rol
      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return NextResponse.json(
          { message: "No autorizado" },
          { status: 403 }
        );
      }

      //  Ejecutar handler con usuario
      return handler(req, decoded);

    } catch (error) {
      return NextResponse.json(
        { message: "Token inválido" },
        { status: 401 }
      );
    }
  };
}