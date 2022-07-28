import express from 'express'
import FoodsModel from '../models/food-model.js'
import paginatedResults from '../middleware/paginatedResults.js'
import { addFood, getFood, deleteFood, updateFood } from '../controllers/foods.js'

const router = express.Router()

// ? means optional parameter (must be here for other requests to work)
router.get('/:page/:limit/:itemId?/:createdAt?', paginatedResults(FoodsModel), getFood)
router.post('/', addFood)
router.delete('/:foodId/:imgName?', deleteFood)
router.patch('/:foodId', updateFood)

export default router
