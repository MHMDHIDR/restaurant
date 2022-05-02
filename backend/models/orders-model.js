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
    //order personal data
    personName: reqString,
    personPhone: reqNumber,
    personNotes: {
      type: String
    },
    //order food data
    orderStatus,
    orderDate: {
      type: String,
      required: true,
      default: new Date().toLocaleDateString('ar-QA', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })
      //	الأحد، ١٣ مارس ٢٠٢٢, ٩:٢٦:٢٣ م
    },
    //ordered food data
    orderItems: reqObject,
    grandPrice: reqNumber
  },
  //Collection Name
  { collection: 'restaurant_orders' }
)

const FoodModel = connection.model('restaurant', OrderSchema)

module.exports = FoodModel
