import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthPayload {
  id: string;
  email: string;
  role: "admin" | "user";
}

export function verifyToken(request: NextRequest): AuthPayload | null {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) return null;

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthPayload;

    return payload;
  } catch {
    return null;
  }
}

export function withAuth(
  handler: (req: NextRequest, user: AuthPayload) => Promise<NextResponse>,
  allowedRoles?: ("admin" | "user")[]
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const user = verifyToken(req);

    if (!user) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { message: "No tienes permisos para acceder aquí" },
        { status: 403 }
      );
    }

    return handler(req, user);
  };
}