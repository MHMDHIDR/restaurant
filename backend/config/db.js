const mongoose = require('mongoose')

//Mongoose connect using async/await
const connectDB = () => {
  try {
    mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  } finally {
    mongoose.connection.close()
  }
}

module.exports = connectDB
