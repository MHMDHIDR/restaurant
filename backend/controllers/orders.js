const mongoose = require('mongoose')
const OrdersModel = require(`${__dirname}/../models/orders-model.js`)
const asyncHandler = require('express-async-handler')
const { v4: uuidv4 } = require('uuid')

const getOrders = asyncHandler(async (req, res) => {
  res.json(res.paginatedResults)
})

const addOrder = asyncHandler(async (req, res) => {
  const {
    personName,
    personPhone,
    personNotes,
    foodItems,
    checkedToppings,
    grandPrice,
    paymentData
  } = req.body

  try {
    const orders = new OrdersModel({
      orderId: uuidv4(),
      personName,
      personPhone,
      personNotes,
      orderItems: JSON.parse(foodItems),
      orderToppings: JSON.parse(checkedToppings),
      grandPrice,
      paymentData: JSON.parse(paymentData)
    })

    await orders.save()

    res.json({
      message: `
        شكراً لك على الانتظار، تم طلب الوجبة بنجاح   😄  ✅  سيتم التواصل معك في رقم هاتفك عندما
        يكون الطلب جاهزاً للتوصيل 📞
        في هذه الأثناء حاول التجول في باقي المطعم واختر ما يعجبك من قائمة الوجبات    😃
        جارِ اعادة التحويل...
      `,
      orderAdded: 1
    })
  } catch (error) {
    res.json({
      message: `Sorry! Something went wrong, check the error => 😥: \n ${error}`,
      orderAdded: 0
    })
  }
})

//this route for accepting or rejcting an order from dashboard
const updateOrder = asyncHandler(async (req, res) => {
  const _id = req.params.orderId
  const { orderStatus } = req.body

  //if not valid _id then return error message
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.json({ message: `Sorry, No Order with this ID => ${_id}` })
  }

  //else update the order status
  try {
    await OrdersModel.findByIdAndUpdate(
      _id,
      {
        orderStatus
      },
      { new: true }
    )

    res.status(200).json({
      message: 'Order Status Updated Successfully',
      OrderStatusUpdated: 1
    })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

const deleteOrder = asyncHandler(async (req, res) => {
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

module.exports = { addOrder, getOrders, updateOrder, deleteOrder }
