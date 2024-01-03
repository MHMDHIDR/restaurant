//import librairies/frameworks
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import connectDB from './config/db.js'
import cors from 'cors'
import fileUpload from 'express-fileupload'

//Routes
import foods from './routes/foods.js'
import settings from './routes/settings.js'
import orders from './routes/orders.js'
import users from './routes/users.js'
import contact from './routes/contact.js'

const app = express()

//PORT
const PORT = process.env.PORT || 5000

//DON't SHOW EXPRESS IN RESPONSE HEADERS
app.disable('x-powered-by')

//APP Use
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(fileUpload())
app.use(
  cors({
    origin: [
      `https://mhmdhidr-restaurant.netlify.app`,
      `http://dev.com:3000`,
      `http://localhost:3000`
    ]
  })
)

//Main GET Route
app.get('/', (_req, res) =>
  res.send(
    `<body style='overflow:hidden;word-spacing:2rem;height:100vh;display:grid;place-items:center;font-size:3em;font-weight:bold;color:white;background-color:#222'>WELCOME TO RESTAURANT API</body>`
  )
)

// Use Routes
app.use('/foods', foods)
app.use('/settings', settings)
app.use('/orders', orders)
app.use('/users', users)
app.use('/contact', contact)

connectDB()

app.listen(PORT, () => console.log(`CONNECTED MONGO, SERVER PORT: ${PORT}`))
