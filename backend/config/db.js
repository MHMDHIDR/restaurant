import mongoose from 'mongoose'

//Mongoose connect using async/await
const connectDB = () => {
  try {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.CONNECTION_URL, {})
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  } finally {
    mongoose.connection.close()
  }
}

export default connectDB
