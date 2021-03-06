import express from 'express'
import paginatedResults from '../middleware/paginatedResults.js'
import OrdersModel from '../models/orders-model.js'
import protect from '../middleware/authMiddleware.js'
import { addOrder, getOrders, updateOrder, deleteOrder } from '../controllers/orders.js'

const router = express.Router()

router.get(
  '/:page/:limit/:itemId?/:orderDate?',
  protect,
  paginatedResults(OrdersModel),
  getOrders
)
router.post('/', addOrder)
router.patch('/:orderId', updateOrder)
router.delete('/:orderId', deleteOrder)

export default router
