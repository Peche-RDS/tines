import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
})

export async function sendResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: `"Login App" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Recuperar contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #e88fa0;">Recuperar contraseña</h2>
        <p>Haz clic en el botón para restablecer tu contraseña. El enlace expira en <strong>1 hora</strong>.</p>
        <a href="${resetUrl}"
          style="display:inline-block; background:#e88fa0; color:white; padding:12px 24px;
                 border-radius:8px; text-decoration:none; font-weight:bold; margin: 16px 0;">
          Restablecer contraseña
        </a>
        <p style="color: #999; font-size: 12px;">
          Si no solicitaste esto, ignora este correo.
        </p>
      </div>
    `,
  })
}