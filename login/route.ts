import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validación básica
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Correo y contraseña son obligatorios' },
        { status: 400 }
      )
    }

    // Buscar usuario
    const user = await db.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // 🔐 Generar JWT con ROLE (CLAVE)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, //  IMPORTANTE
      },
      process.env.JWT_SECRET || 'secreto_temporal',
      { expiresIn: '7d' }
    )

    // 📦 Respuesta
    const response = NextResponse.json(
      {
        message: 'Login exitoso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, //  IMPORTANTE
        },
      },
      { status: 200 }
    )

    // 🍪 Guardar token en cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response

  } catch (error) {
    console.error('Error en login:', error)

    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}