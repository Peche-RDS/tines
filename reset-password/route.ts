import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token y contraseña son obligatorios' },
        { status: 400 }
      )
    }

    // Buscar usuario con ese token válido y no expirado
    const user = await db.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { gt: new Date() },
      },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'El enlace es inválido o ha expirado' },
        { status: 400 }
      )
    }

    // Actualizar contraseña y limpiar token
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    })

    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en reset de contraseña:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}