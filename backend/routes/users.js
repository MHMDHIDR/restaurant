const express = require('express')
const paginatedResults = require(`${__dirname}/../middleware/paginatedResults.js`)
const UserModel = require(`${__dirname}/../models/user-model.js`)
const { protect } = require(`${__dirname}/../middleware/authMiddleware.js`)
const router = express.Router()
const {
  joinUser,
  loginUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser
} = require(`${__dirname}/../controllers/users.js`)

router.post('/join', joinUser)
router.post('/login', loginUser)
router.get('/all/:page/:limit/:itemId?', paginatedResults(UserModel), getAllUsers)
router.get('/', protect, getUser)
router.delete('/:userId', deleteUser)
router.patch('/:userId', updateUser)

module.exports = router
