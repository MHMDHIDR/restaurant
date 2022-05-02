const mongoose = require('mongoose')
const connection = mongoose.createConnection(process.env.CONNECTION_URL)

const reqString = {
  type: String,
  required: true
}

const reqDate = {
  type: Date,
  default: Date.now,
  required: true
}

const FoodSchema = new mongoose.Schema(
  {
    foodImgDisplayPath: reqString,
    foodImgDisplayName: reqString,
    foodName: reqString,
    foodPrice: reqString,
    category: reqString,
    foodDesc: reqString,
    createdAt: reqDate,
    updatedAt: reqDate
  },
  //Collection Name
  { collection: 'restaurant_food' }
)

const WorkModel = connection.model('restaurant', FoodSchema)

module.exports = WorkModel
