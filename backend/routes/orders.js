const express = require('express')
const paginatedResults = require(`${__dirname}/../middleware/paginatedResults.js`)
const OrdersModel = require(`${__dirname}/../models/orders-model.js`)
const router = express.Router()
const {
  addOrder,
  getOrders,
  updateOrder,
  deleteOrder
} = require(`${__dirname}/../controllers/orders.js`)

router.get('/:page/:limit/:itemId?/:orderDate?', paginatedResults(OrdersModel), getOrders)
router.post('/', addOrder)
router.patch('/:orderId', updateOrder)
router.delete('/:orderId', deleteOrder)

module.exports = router
