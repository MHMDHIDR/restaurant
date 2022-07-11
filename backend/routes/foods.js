const express = require('express')
const paginatedResults = require(`${__dirname}/../middleware/paginatedResults.js`)
const FoodsModel = require(`${__dirname}/../models/food-model.js`)
const router = express.Router()
const {
  addFood,
  getFood,
  deleteFood,
  updateFood
} = require(`${__dirname}/../controllers/foods.js`)

// ? means optional parameter (must be here for other requests to work)
router.get('/:page/:limit/:itemId?/:createdAt?', paginatedResults(FoodsModel), getFood)
router.post('/', addFood)
router.delete('/:foodId/:imgName?', deleteFood)
router.patch('/:foodId', updateFood)

module.exports = router
