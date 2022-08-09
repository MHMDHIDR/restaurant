import FoodsModel from '../models/food-model.js'
import { v4 as uuidv4 } from 'uuid'
import asyncHandler from 'express-async-handler'
import sharp from 'sharp'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

export const addFood = asyncHandler(async (req, res) => {
  const { foodName, foodPrice, category, foodDesc, foodToppings, foodTags } = req.body
  const toppings = foodToppings && JSON.parse(foodToppings)
  const tags = JSON.parse(foodTags)

  const { foodImg } = req.files
  const foodImgs = foodImg && Array.isArray(foodImg) ? foodImg : [foodImg]
  const foodImgNames = foodImgs?.map(img => uuidv4() + img.name.split('.')[0] + '.webp')

  const uploadToS3 = async (img, imgName) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imgName,
      Body: img,
      ContentType: 'image/webp'
    }
    const imgUpload = await s3.upload(params).promise()
    return imgUpload.Location
  }

  const foodImgUrls = await Promise.all(
    foodImgs.map(async (img, index) => {
      const foodImgDisplayName = foodImgNames[index]
      const foodImgDisplayPath = await uploadToS3(img.data, foodImgDisplayName)
      return { foodImgDisplayName, foodImgDisplayPath }
    })
  )

  const food = await FoodsModel.create({
    foodName,
    foodPrice,
    category,
    foodDesc,
    foodToppings: toppings,
    foodTags: tags,
    foodImgs: foodImgUrls.map(({ foodImgDisplayName, foodImgDisplayPath }) => {
      return {
        foodImgDisplayName,
        foodImgDisplayPath
      }
    })
  })
  res.status(201).json({
    foodAdded: 1,
    message: 'Food added successfully'
  })
})

export const getFood = asyncHandler(async (req, res) => {
  res.json(res.paginatedResults)
})

export const deleteFood = asyncHandler((req, res) => {
  const { foodId, imgName } = req.params

  if (imgName) {
    s3.deleteObject(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imgName
      },
      async (err, data) => {
        if (err) {
          res.json({
            message: error,
            ImgDeleted: 0
          })
          return
        }

        try {
          //find the food and delete the img by using the imgName
          const food = await FoodsModel.findById(foodId)
          const foodImgs = food.foodImgs.filter(img => img.foodImgDisplayName !== imgName)
          await FoodsModel.findByIdAndUpdate(foodId, { foodImgs })

          res.json({
            message: 'Image Deleted Successfully',
            ImgDeleted: 1
          })
          return
        } catch (error) {
          res.json({
            message: `Sorry! Something went wrong while deleting Image, check the error => 😥: \n ${error}`,
            ImgDeleted: 0
          })
          return
        }
      }
    )
  } else {
    const prevFoodImgPathsAndNames = JSON.parse(req.body.prevFoodImgPathsAndNames)
    //delete the old images from s3 bucket using the prevFoodImgPathsAndNames
    const Objects = prevFoodImgPathsAndNames.map(({ foodImgDisplayName }) => ({
      Key: foodImgDisplayName
    }))

    s3.deleteObjects(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: { Objects }
      },
      async (error, data) => {
        if (error) {
          res.json({
            message: error,
            foodDeleted: 0
          })
          return
        }

        try {
          await FoodsModel.findByIdAndDelete(foodId)

          res.json({
            message: 'Food Deleted Successfully',
            foodDeleted: 1
          })
          return
        } catch (error) {
          res.json({
            message: `Sorry! Something went wrong, check the error => 😥: \n ${error}`,
            foodDeleted: 0
          })
          return
        }
      }
    )
  }
})

export const updateFood = asyncHandler(async (req, res) => {
  const { foodName, foodPrice, foodDesc, foodToppings, foodTags, category } = req.body
  const prevFoodImgPathsAndNames = JSON.parse(req.body.prevFoodImgPathsAndNames)

  const toppings = foodToppings && JSON.parse(foodToppings)
  const tags = JSON.parse(foodTags)
  const { foodId } = req.params

  //if the user has uploaded a new image
  if (req.files) {
    const { foodImg } = req.files
    const foodImgs = foodImg && Array.isArray(foodImg) ? foodImg : [foodImg]
    const foodImgNames = foodImgs?.map(img => uuidv4() + img.name.split('.')[0] + '.webp')

    let foodImgDisplayPath = prevFoodImgPathsAndNames.map(
      ({ foodImgDisplayPath }) => foodImgDisplayPath
    )
    let foodImgDisplayName = prevFoodImgPathsAndNames.map(
      ({ foodImgDisplayName }) => foodImgDisplayName
    )

    //delete the old images from s3 bucket using the prevFoodImgPathsAndNames
    // const Objects = prevFoodImgPathsAndNames.map(({ foodImgDisplayName }) => ({
    //   Key: foodImgDisplayName
    // }))

    // s3.deleteObjects(
    //   {
    //     Bucket: process.env.AWS_BUCKET_NAME,
    //     Delete: { Objects }
    //   },
    //   (error, data) => {
    //     if (error) {
    //       res.json({
    //         message: error,
    //         foodUpdated: 0
    //       })
    //       return
    //     }
    //   }
    // )

    //if no error in deleting old image, then upload the new image to s3 bucket by using the new foodImgs sharp
    foodImgs.map((img, index) => {
      sharp(img.data)
        .resize(600)
        .jpeg({ mozjpeg: true, quality: 50 })
        .toBuffer()
        .then(newWebpImg => {
          //changing the old jpg image buffer to new webp buffer
          img.data = newWebpImg

          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: foodImgNames[index],
            Body: newWebpImg,
            ContentType: 'image/webp'
          } //uploading the new webp image to s3 bucket, self executing function
          ;(async () => {
            try {
              const { Location } = await s3.upload(params).promise()

              //saving the new image path to the database
              foodImgDisplayPath.push(Location)
              foodImgDisplayName.push(Location.split('.com/')[1])
              if (index === foodImgs.length - 1) {
                await FoodsModel.findByIdAndUpdate(
                  foodId,
                  {
                    foodImgs: foodImgs.map((img, index) => ({
                      foodImgDisplayName: foodImgDisplayName[index],
                      foodImgDisplayPath: foodImgDisplayPath[index]
                    })),
                    foodName,
                    foodPrice,
                    category,
                    foodDesc,
                    foodToppings: toppings,
                    foodTags: tags,
                    updatedAt: Date.now()
                  },
                  { new: true }
                )
                res.json({
                  message: 'Food Updated Successfully',
                  foodUpdated: 1
                })
                return
              }
            } catch (error) {
              res.json({
                message: error,
                foodUpdated: 0
              })
              return
            }
          })()
        })
        .catch(err => {
          res.json({
            message: `Sorry! Something went wrong, check the error => 😥: \n ${err}`,
            foodUpdated: 0
          })
        })
    })
    //==========================================================
  } else {
    try {
      await FoodsModel.findByIdAndUpdate(foodId, {
        foodName,
        foodPrice,
        category,
        foodDesc,
        foodToppings: toppings,
        foodTags: tags,
        updatedAt: Date.now()
      })

      res.json({
        message: 'Food Updated Successfully',
        foodUpdated: 1
      })
      return
    } catch (error) {
      res.json({
        message: `Sorry! Something went wrong, check the error => 😥: \n ${error}`,
        foodUpdated: 0
      })
      return
    }
  }
})
