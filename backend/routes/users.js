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
  googleLoginSuccess,
  googleLoginFailed,
  googleLogout,
  googleAuth,
  googleCallback
} from '../controllers/users.js'

const router = express.Router()

router.post('/join', joinUser)
router.post('/login', loginUser)
router.get('/all/:page/:limit/:itemId?', paginatedResults(UserModel), getAllUsers)
router.get('/', protect, getUser)
router.delete('/:userId', deleteUser)
router.patch('/:userId', updateUser)
router.post('/forgotpass', forgotPass)
router.post('/resetpass', resetPass)

export default router
