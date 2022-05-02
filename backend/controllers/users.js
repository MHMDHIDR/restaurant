const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const UserModel = require(`${__dirname}/../models/user-model.js`)

const joinUser = asyncHandler(async (req, res) => {
  const { userFullName, userEmail, userPassword } = req.body

  if (userFullName === '' || userEmail === '' || userPassword === '') {
    res.sendStatus(400)
    return
  }

  // Check if user exists
  const userExists = await UserModel.findOne({ userEmail })

  if (userExists) return res.sendStatus(409)

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(userPassword, salt)

  // Create user
  const user = await UserModel.create({
    userFullName,
    userEmail,
    userPassword: hashedPassword
  })

  //if user is created successfully
  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      token: generateToken(user._id),
      userAdded: 1,
      message: 'تم تسجيل المستخدم بنجاح، يمكنك تسجيل الدخول الان'
    })
  } else {
    res.status(400).json({
      userAdded: 0,
      message: 'لم يتم تسجيل المستخدم!'
    })
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const { userEmail, userPassword } = req.body
  // Check for user by using his/her email
  const user = await UserModel.findOne({ userEmail })

  if (user && user.userAccountStatus === 'block') {
    res.status(403).json({
      LoggedIn: 0,
      message: 'حسابك مغلق حاليا، يرجى التواصل مع الادارة'
    })
  } else if (user && (await bcrypt.compare(userPassword, user.userPassword))) {
    res.status(200).json({
      LoggedIn: 1,
      message: 'تم تسجيل الدخول بنجاح، جار تحويلك الى لوحة التحكم',
      _id: user.id,
      email: user.userEmail,
      token: generateToken(user._id)
    })
  } else {
    res.json({
      LoggedIn: 0,
      message: 'البريد الالكتروني او كلمة المرور غير صحيحة'
    })
  }
})

const getUser = asyncHandler(async (req, res) => {
  const { _id, userEmail } = await UserModel.findById(req.user.id)

  res.status(200).json({
    id: _id,
    email: userEmail
  })
})

const getAllUsers = asyncHandler(async (req, res) => {
  res.json(res.paginatedResults)
})

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params

  try {
    await UserModel.findByIdAndDelete(userId)

    res.json({
      message: 'User Deleted Successfully',
      userDeleted: 1
    })
  } catch (error) {
    res.json({
      message: `Sorry! Something went wrong, check the error => 😥: \n ${error}`,
      userDeleted: 0
    })
  }
})

const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const { userAccountStatus } = req.body

  //if not valid id then return error message
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.json({ message: `Sorry, No User with this ID => ${userId}` })
  }

  //else update the user status
  try {
    await UserModel.findByIdAndUpdate(
      userId,
      {
        userAccountStatus
      },
      { new: true }
    )

    res.status(200).json({
      message: 'User Status Updated Successfully',
      userStatusUpdated: 1
    })
  } catch (error) {
    res.status(404).json({ message: error.message, userStatusUpdated: 0 })
  }
})

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

module.exports = {
  joinUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser
}
