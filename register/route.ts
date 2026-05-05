import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ 
  connectionString: "postgresql://postgres:123456@localhost:5432/loginregister_db"
})
const db = new PrismaClient({ adapter })

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json(
        { message: 'El correo ya está registrado' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.user.create({
      data: { name, email, password: hashedPassword },
    })

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}