import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import Types from 'mongoose'
import UserModel from '../models/user-model.js'
import { v4 as uuidv4 } from 'uuid'
import email from '../utils/email.js'

export const joinUser = asyncHandler(async (req, res) => {
  const { userFullName, userEmail, userTel, userPassword } = req.body

  if (userFullName === '' || userEmail === '' || userTel === '' || userPassword === '') {
    res.sendStatus(400)
    return
  }

  // Check if user exists
  const userExists = await UserModel.findOne({ userEmail, userTel })

  if (userExists) return res.sendStatus(409)

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(userPassword, salt)

  // Create user
  const user = await UserModel.create({
    userFullName,
    userEmail,
    userTel,
    userPassword: hashedPassword
  })

  //if user is created successfully
  if (user) {
    res.status(201).json({
      _id: user.id,
      email: user.email,
      tel: user.tel,
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

export const loginUser = asyncHandler(async (req, res) => {
  const { userEmail, userTel, userPassword } = req.body
  // Check for user by using his/her email or telephone number
  const user = await UserModel.findOne({
    $or: [{ userEmail }, { userTel }]
  })

  if (user && user.userAccountAction === 'block') {
    res.status(403).json({
      LoggedIn: 0,
      message: 'حسابك مغلق حاليا، يرجى التواصل مع الادارة'
    })
  } else if (user && (await bcrypt.compare(userPassword, user.userPassword))) {
    res.status(200).json({
      LoggedIn: 1,
      message: 'تم تسجيل الدخول بنجاح، جار تحويلك الى لوحة التحكم',
      _id: user.id,
      userAccountType: user.userAccountType,
      userEmail: user.userEmail,
      userTel: user.userTel,
      token: generateToken(user._id)
    })
  } else {
    res.json({
      LoggedIn: 0,
      message: 'البيانات المدخلة غير صحيحة'
    })
  }
})

export const getUser = asyncHandler(async (req, res) => {
  const { _id, userEmail } = await UserModel.findById(req.user.id)

  res.status(200).json({
    id: _id,
    email: userEmail
  })
})

export const getAllUsers = asyncHandler(async (req, res) => {
  res.json(res.paginatedResults)
})

export const deleteUser = asyncHandler(async (req, res) => {
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

export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params
  const { userAccountAction } = req.body

  //if not valid id then return error message
  if (!Types.ObjectId.isValid(userId)) {
    return res.json({ message: `Sorry, No User with this ID => ${userId}` })
  }

  //else update the user status
  try {
    await UserModel.findByIdAndUpdate(
      userId,
      //check if its a change of status or type
      userAccountAction === 'active' || userAccountAction === 'block'
        ? { userAccountStatus: userAccountAction }
        : { userAccountType: userAccountAction },
      { new: true }
    )

    res.status(200).json({
      message: 'User Status Updated Successfully',
      userUpdated: 1
    })
  } catch (error) {
    res.status(404).json({ message: error.message, userUpdated: 0 })
  }
})

export const forgotPass = asyncHandler(async (req, res) => {
  const { userEmail, userTel } = req.body
  // Check for user by using his/her email or telephone number
  const user = await UserModel.findOne({
    $or: [{ userEmail }, { userTel }]
  })

  if (user && user.userAccountStatus === 'block') {
    res.status(403).json({
      forgotPassSent: 0,
      message: 'حسابك مغلق حاليا، يرجى التواصل مع الادارة'
    })
  } else if (user && user.userAccountStatus === 'active') {
    const userResetPasswordToken = uuidv4()
    const userResetPasswordExpires = Date.now() + 3600000

    await UserModel.findByIdAndUpdate(user._id, {
      userResetPasswordToken,
      userResetPasswordExpires
    })

    //send the user an email with a link to reset his/her password
    const resetLink = `http://dev.com:3000/auth/reset/${userResetPasswordToken}`

    const emailData = {
      from: 'mr.hamood277@gmail.com',
      to: user.userEmail,
      subject: 'Reset Password',
      msg: `
        <h1>You have requested to reset your password</h1>
        <p>
          Please <a href="${resetLink}" target="_blank">Click Here</a>
          to reset your password, OR use the following link to reset your password: ${resetLink}

          <small>If you did not request this, please ignore this email and your password will remain unchanged.</small>
          <small>Note: This link will expire in 1 hour</small>
        </p>
      `
    }

    try {
      const { accepted, rejected } = await email(emailData)

      if (accepted.length > 0) {
        res.status(200).json({
          message: 'تم ارسال رابط اعادة تعيين كلمة المرور الى بريدك الالكتروني',
          forgotPassSent: 1
        })
      } else if (rejected.length > 0) {
        res.status(400).json({
          forgotPassSent: 0,
          message: `عفواً، لم نستطع ارسال رابط اعادة تعيين كلمة المرور الى بريدك الالكتروني: ${rejected[0].message}`
        })
      }
    } catch (err) {
      res.json({ message: `Ooops!, something went wrong!: ${error} `, mailSent: 0 })
    }
  } else {
    res.json({
      forgotPassSent: 0,
      message: 'عفواً، ليس لديك حساب مسجل معنا'
    })
  }
})

export const resetPass = asyncHandler(async (req, res) => {
  const { userPass, userToken } = req.body
  // Check for user by using his/her email or telephone number
  const user = await UserModel.findOne({
    $or: [{ userPass }, { userToken }]
  })

  if (user && user.userAccountStatus === 'block') {
    res.status(403).json({
      forgotPassSent: 0,
      message: 'حسابك مغلق حاليا، يرجى التواصل مع الادارة'
    })
  } else if (user && user.userAccountStatus === 'active') {
    if (userToken === user.userResetPasswordToken) {
      if (userResetPasswordExpires > Date.now()) {
        await UserModel.findByIdAndUpdate(user._id, {
          userPass,
          userResetPasswordToken: null,
          userResetPasswordExpires: null
        })

        res.status(200).json({
          message: 'تم تغيير كلمة المرور بنجاح',
          newPassSet: 1
        })
      } else {
        res.status(400).json({
          newPassSet: 0,
          message: 'عفواً، لقد انتهى صلاحية رابط اعادة تعيين كلمة المرور الخاص بك'
        })
      }
    }

    //send the user an email with a link to reset his/her password
    const emailData = {
      from: 'mr.hamood277@gmail.com',
      to: user.userEmail,
      subject: 'Password Has been Reset',
      msg: `
        <h1>Your password has been rest succefully</h1>
        <br />
        <p>
          If you did not reset your password, please contact us as soon as possible, otherwise this email is just for notifying you for the change that happened.</small>
        </p>
      `
    }

    try {
      const { accepted, rejected } = await email(emailData)

      if (accepted.length > 0) {
        res.status(200).json({
          message: 'تم ارسال رابط اعادة تعيين كلمة المرور الى بريدك الالكتروني',
          forgotPassSent: 1
        })
      } else if (rejected.length > 0) {
        res.status(400).json({
          forgotPassSent: 0,
          message: `عفواً، لم نستطع ارسال رابط اعادة تعيين كلمة المرور الى بريدك الالكتروني: ${rejected[0].message}`
        })
      }
    } catch (err) {
      res.json({ message: `Ooops!, something went wrong!: ${error} `, mailSent: 0 })
    }
  } else if (!user) {
    res.json({
      forgotPassSent: 0,
      message: 'عفواً، ليس لديك حساب مسجل معنا'
    })
  }
})

const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
