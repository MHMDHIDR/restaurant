import React from 'react'
import ReactDOM from 'react-dom'

const PayPalButton = (window as any)?.paypal?.Buttons?.driver('react', {
  React,
  ReactDOM
})

const PaymentButton = ({ value, onSuccess }) => {
  const createOrder = (
    _: any,
    actions: {
      order: { create: (arg0: { purchase_units: { amount: { value: any } }[] }) => any }
    }
  ) => actions.order.create({ purchase_units: [{ amount: { value } }] })

  const onApprove = async (data: any, actions: { order: { capture: () => any } }) => {
    await actions.order.capture()
    onSuccess(data)
    return data
  }

  const onCancel = () => alert('cancelled Payment')

  const onError = (error: any) => console.error('some error happened=> ', error)

  return (
    <PayPalButton
      createOrder={(
        data: any,
        actions: {
          order: {
            create: (arg0: { purchase_units: { amount: { value: any } }[] }) => any
          }
        }
      ) => createOrder(data, actions)}
      onApprove={(data: any, actions: { order: { capture: () => any } }) =>
        onApprove(data, actions)
      }
      onCancel={onCancel}
      onError={(err: any) => onError(err)}
    />
  )
}

export default PaymentButton
