const mongoose = require('mongoose')
const connection = mongoose.createConnection(process.env.CONNECTION_URL)

const reqString = {
  type: String,
  required: true
}

const reqNumber = {
  type: Number,
  required: true
}

const normalArray = {
  type: Array
}

const foodToppingsType = {
  type: Object,
  default: [
    {
      toppingName: reqString,
      toppingPrice: reqNumber
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
    foodImgs: normalArray,
    foodName: reqString,
    foodPrice: reqString,
    category: reqString,
    foodDesc: reqString,
    foodToppings: foodToppingsType,
    foodTags: normalArray,
    createdAt: reqDate,
    updatedAt: reqDate
  },
  //Collection Name
  { collection: 'restaurant_food' }
)

const WorkModel = connection.model('restaurant', FoodSchema)

module.exports = WorkModel
