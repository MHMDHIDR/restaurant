import nodemailer from 'nodemailer'
import asyncHandler from 'express-async-handler'

const email = asyncHandler(async ({ name, subject, from, to, msg }) => {
  /**
   * @returns {Promise<any>} JSON
   */

  to = to || process.env.MAILER_EMAIL
  from = from || process.env.MAILER_EMAIL
  name = name || to

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD
    }
  })

  // send mail with defined transport object
  const emailResponse = await transporter.sendMail({
    subject,
    from: `"${name}" <${from}>`,
    to,
    html: msg
  })

  return emailResponse
})

export default email
