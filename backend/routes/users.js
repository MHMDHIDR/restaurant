import express from 'express'
import paginatedResults from '../middleware/paginatedResults.js'
import UserModel from '../models/user-model.js'
import protect from '../middleware/authMiddleware.js'

import {
  joinUser,
  loginUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  forgotPass,
  resetPass,
  googleLogin
} from '../controllers/users.js'

const router = express.Router()

router.get('/all/:page/:limit/:itemId?', paginatedResults(UserModel), getAllUsers)
router.get('/', protect, getUser)
router.post('/join', joinUser)
router.post('/login', loginUser)
router.post('/forgotpass', forgotPass)
router.post('/resetpass', resetPass)
router.post('/googleLogin', googleLogin)
router.patch('/:userId', updateUser)
router.delete('/:userId', deleteUser)

export default router
