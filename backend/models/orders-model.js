const mongoose = require('mongoose')
const connection = mongoose.createConnection(process.env.CONNECTION_URL)

const reqNumber = {
  type: Number,
  required: true
}

const reqString = {
  type: String,
  required: true
}

const reqObject = {
  type: Object,
  required: true
}

const orderStatus = {
  ...reqString,
  enum: ['pending', 'accept', 'reject'],
  default: 'pending'
}

const OrderSchema = new mongoose.Schema(
  {
    orderId: reqString,
    userId: reqString,
    userEmail: reqString,
    personName: reqString,
    personPhone: reqNumber,
    personAddress: reqString,
    personNotes: {
      type: String
    },
    orderItems: reqObject,
    orderToppings: reqObject,
    grandPrice: reqNumber,
    paymentData: reqObject,
    orderStatus,
    orderDate: {
      type: String,
      required: true,
      default: new Date().toLocaleDateString('ar-EG', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })
    }
  },
  //Collection Name
  { collection: 'restaurant_orders' }
)

const FoodModel = connection.model('restaurant', OrderSchema)

module.exports = FoodModel
