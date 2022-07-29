import email from '../utils/email.js'

export const sendEmail = (req, res) => {
  let { name, subject, from, to, msg } = req.body

  if (name === '' || from === '' || to === '' || msg === '') {
    res.sendStatus(400)
    return
  }

  const emailResponse = email(name, subject, from, to, msg) //{accepted, rejected}

  emailResponse
    .then(({ accepted, rejected }) => {
      if (accepted.length > 0) {
        res.status(200).json({
          message: 'Email Sent Successfully',
          mailSent: 1
        })
        return
      } else if (rejected.length > 0) {
        res.status(400).json({
          message: `Sorry, Something went Wrong! ==> ${rejected[0].message}`,
          mailSent: 0
        })
        return
      }
    })
    .catch(err => {
      res.status(400).json({
        message: `Sorry, Something went Wrong! ==> ${err}`,
        mailSent: 0
      })
    })
}
