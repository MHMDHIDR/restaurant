export const validEmail = email => {
  const emailFormat =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+")){3,}@((\[[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}\.[0-9]{2,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,15}))$/

  return email.match(emailFormat) ? true : false
}

export const validPassword = password => {
  const passwordFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/

  return password.match(passwordFormat) ? true : false
}

export const validPhone = phone => {
  const phoneFormat = new RegExp('^[0-9]{1,8}$', 'g')

  return phone.match(phoneFormat) ? true : false
}
