import email from '../utils/email.js'

export const sendEmail = async (req, res) => {
  let { name, subject, from, to, msg } = req.body

  if (name === '' || from === '' || to === '' || msg === '') {
    res.sendStatus(400)
    return
  }

  try {
    const emailData = {
      name,
      subject,
      from,
      to,
      msg
    }

    const { accepted, rejected } = await email(emailData)
    if (accepted.length > 0) {
      res.status(200).json({
        message: 'Email Sent Successfully',
        mailSent: 1
      })
    } else if (rejected.length > 0) {
      res.status(400).json({
        message: `Sorry, Something went Wrong! ==> ${rejected[0].message}`,
        mailSent: 0
      })
    }
  } catch (err) {
    res.json({ message: `Ooops!, something went wrong!: ${error} `, mailSent: 0 })
  }
}
