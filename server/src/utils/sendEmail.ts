import nodemailer from 'nodemailer'

const sendEmail = async (to: string, subject: string, content: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_APIKEY,
    },
  })

  await transporter.sendMail({
    from: '"TangoBox" <noreply@tangobox.app>',
    to,
    subject,
    html: content,
  })
}

export default sendEmail
