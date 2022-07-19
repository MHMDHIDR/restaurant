import React from 'react'
import ReactDOM from 'react-dom'
const PayPalButton = window.paypal.Buttons.driver('react', { React, ReactDOM })

const PaymentButton = ({ value }) => {
  const createOrder = (_, actions) =>
    actions.order.create({ purchase_units: [{ amount: { value } }] })

  const onApprove = (_, actions) => actions.order.capture()

  const onError = error => error

  const onCancel = () => console.log('cancelled')

  return (
    <PayPalButton
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
      onError={err => onError(err)}
      onCancel={onCancel}
    />
  )
}

export default PaymentButton
