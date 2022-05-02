const mongoose = require('mongoose')
const connection = mongoose.createConnection(process.env.CONNECTION_URL)

const reqString = {
  type: String,
  required: true
}

const userAccountStatus = {
  ...reqString,
  enum: ['active', 'block'],
  default: 'block'
}

const UserSchema = new mongoose.Schema(
  {
    userFullName: reqString,
    userEmail: reqString,
    userPassword: reqString,
    userAccountStatus
  },
  //Collection Name
  { collection: 'restaurant_users' }
)

const UserModel = connection.model('restaurant', UserSchema)

module.exports = UserModel
