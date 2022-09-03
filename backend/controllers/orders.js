import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'
import OrdersModel from '../models/orders-model.js'
import { v4 as uuidv4 } from 'uuid'
import email from '../utils/email.js'

export const getOrders = asyncHandler(async (_req, res) => {
  res.json(res.paginatedResults)
})

export const addOrder = asyncHandler(async (req, res) => {
  const {
    userId,
    userEmail,
    personName,
    personPhone,
    personAddress,
    personNotes,
    foodItems,
    checkedToppings,
    grandPrice,
    paymentData
  } = req.body

  try {
    const orders = new OrdersModel({
      orderId: uuidv4(),
      userId,
      userEmail,
      personName,
      personPhone,
      personAddress,
      personNotes,
      orderItems: JSON.parse(foodItems),
      orderToppings: JSON.parse(checkedToppings),
      grandPrice,
      paymentData: JSON.parse(paymentData)
    })

    await orders.save()
    res.json({ orderAdded: 1 })
  } catch ({ message }) {
    res.json({ message, orderAdded: 0 })
  }
})

export const updateOrder = asyncHandler(async (req, res) => {
  const _id = req.params.orderId
  const {
    orderEmail,
    personName,
    personPhone,
    personAddress,
    personNotes,
    foodItems,
    checkedToppings,
    grandPrice,
    orderStatus
  } = req.body

  //if not valid _id then return error message
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.json({ message: `Sorry, No Order with this ID => ${_id}` })
  }

  //else update the order status
  try {
    const orderUpdated = personName
      ? await OrdersModel.findByIdAndUpdate(
          //update all order data
          _id,
          {
            personName,
            personPhone,
            personAddress,
            personNotes,
            orderItems: JSON.parse(foodItems),
            orderToppings: JSON.parse(checkedToppings),
            grandPrice
          },
          { new: true }
        )
      : await OrdersModel.findByIdAndUpdate(_id, { orderStatus }, { new: true }) //only update the order status

    //if order updated then send email to user
    if (orderStatus && orderUpdated) {
      const emailData = {
        from: 'mr.hamood277@gmail.com',
        to: orderEmail,
        subject: `Order is ${orderStatus}ed`,
        msg: `
        <h1>Your Order at Restaurant is ${orderStatus}ed ${
          orderStatus === 'accept' ? '✅ 😃' : '❌ 😢'
        }</h1>
        <p>
          This is an email is to let you know that your order has been ${orderStatus}ed.
          <small>If you have any queries please contact us at Mr.hamood277@gmail.com</small>
        </p>
      `
      }

      const { accepted, rejected } = await email(emailData)

      if (accepted.length > 0) {
        res.status(200).json({
          message: 'Order Status Updated Successfully',
          OrderStatusUpdated: 1
        })
      } else if (rejected.length > 0) {
        res.status(200).json({
          message: 'Error: Order Did NOT Update',
          OrderStatusUpdated: 1
        })
      }
    } else if (orderUpdated) {
      res.status(200).json({
        message: 'Order Status Updated Successfully',
        OrderStatusUpdated: 1
      })
      return
    }

    res.status(200).json({
      message: 'Error: Order Did NOT Update',
      OrderStatusUpdated: 1
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

export const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params

  try {
    await OrdersModel.findByIdAndDelete(orderId)

    res.json({
      message: 'Order Deleted Successfully',
      orderDeleted: 1
    })
  } catch (error) {
    res.json({
      message: `Sorry! Something went wrong, check the error => 😥: \n ${error}`,
      orderDeleted: 0
    })
  }
})
