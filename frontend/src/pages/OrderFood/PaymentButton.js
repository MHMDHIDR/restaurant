import React from 'react'
import ReactDOM from 'react-dom'
const PayPalButton = window?.paypal?.Buttons?.driver('react', { React, ReactDOM })

const PaymentButton = ({ value, onSuccess }) => {
  const createOrder = (_, actions) =>
    actions.order.create({ purchase_units: [{ amount: { value } }] })

  const onApprove = async (_, actions) => {
    await actions.order.capture()
    onSuccess()
  }

  const onCancel = () => console.log('cancelled Payment')

  const onError = error => console.log('some error happened=> ', error)

  return (
    <PayPalButton
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
      onCancel={onCancel}
      onError={err => onError(err)}
    />
  )
}

export default PaymentButton
