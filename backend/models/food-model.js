const mongoose = require('mongoose')
const connection = mongoose.createConnection(process.env.CONNECTION_URL)

const reqString = {
  type: String,
  required: true
}

const typeString = {
  type: String
}

const typeNumber = {
  type: Number
}

const typeArray = {
  type: Array
}

const foodToppingsType = {
  type: Object,
  default: [
    {
      toppingName: typeString,
      toppingPrice: typeNumber
    }
  ]
}

const reqDate = {
  type: Date,
  default: Date.now,
  required: true
}

const FoodSchema = new mongoose.Schema(
  {
    foodImgs: typeArray,
    foodName: reqString,
    foodPrice: reqString,
    category: reqString,
    foodDesc: reqString,
    foodToppings: foodToppingsType,
    foodTags: typeArray,
    createdAt: reqDate,
    updatedAt: {
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
  { collection: 'restaurant_food' }
)

const WorkModel = connection.model('restaurant', FoodSchema)

module.exports = WorkModel
