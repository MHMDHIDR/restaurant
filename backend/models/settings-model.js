const mongoose = require('mongoose')
const connection = mongoose.createConnection(process.env.CONNECTION_URL)

const reqString = {
  type: String,
  required: true
}
const reqArray = {
  type: Array,
  required: true
}

const SettingsSchema = new mongoose.Schema(
  {
    appDesc: reqString,
    appTagline: reqString,
    heroBg: reqArray,
    CategoryList: reqArray
  },
  //Collection Name
  { collection: 'restaurant_settings' }
)

const SettingsModel = connection.model('restaurant', SettingsSchema)

module.exports = SettingsModel
