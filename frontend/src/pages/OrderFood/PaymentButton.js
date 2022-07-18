import React from 'react'
import ReactDOM from 'react-dom'
const PayPalButton = window.paypal.Buttons.driver('react', { React, ReactDOM })
const PaymentButton = ({ value }) => {
  const createOrder = (data, actions) => {
    console.log(data)
    return actions.order.create({ purchase_units: [{ amount: { value } }] })
  }
  const onApprove = (data, actions) => {
    console.log(data)
    return actions.order.capture()
  }

  return (
    <PayPalButton
      createOrder={(data, actions) => createOrder(data, actions)}
      onApprove={(data, actions) => onApprove(data, actions)}
    />
  )
}

export default PaymentButton
