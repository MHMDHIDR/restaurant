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
    html: `
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
      <section style="background-color: #f1b08e; padding: 10px;">
        <a href="https://mhmdhidr-restaurant.netlify.app">
          <img src="https://mhmdhidr-restaurant.netlify.app/assets/img/icons/logo.svg"
            alt="logo"
            width="150" height="150">
        </a>
        <h1 style="text-align: center;font-family: 'Montserrat', sans-serif;">${subject}</h1>
        
        <pre style="font-family: 'Montserrat', sans-serif;">${msg}</pre>

        <!-- footer -->
        <div style="background-color: #f1b08e; padding: 20px;">
          <p>
            <a href="https://mhmdhidr-restaurant.netlify.app">
              <img src="https://mhmdhidr-restaurant.netlify.app/assets/img/icons/logo.svg"
                alt="logo"
                width="150" height="150">
            </a>
          </p>
          <p style="text-align: center; font-weight: bold;font-family: 'Montserrat', sans-serif;">
            All rights reserved.
          </p>
        </div>
      </section>
    `
  })

  return emailResponse
})

export default email
