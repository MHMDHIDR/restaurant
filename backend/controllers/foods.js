const FoodsModel = require(`${__dirname}/../models/food-model.js`)
const { v4: uuidv4 } = require('uuid')
const asyncHandler = require('express-async-handler')
const sharp = require('sharp')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()

const addFood = asyncHandler(async (req, res) => {
  const { foodName, foodPrice, category, foodDesc, foodToppings, foodTags } = req.body
  const toppings = foodToppings && JSON.parse(foodToppings)
  const tags = JSON.parse(foodTags)
  const { foodImg } = req.files
  const foodImgName = uuidv4() + foodImg.name.split('.')[0] + '.webp'

  let foodImgDisplayPath, foodImgDisplayName

  const foods = new FoodsModel({
    foodImgDisplayPath,
    foodImgDisplayName,
    foodName,
    foodPrice,
    category,
    foodDesc,
    foodToppings: toppings,
    foodTags: tags
  })

  sharp(foodImg.data)
    .rotate()
    .resize(600)
    .jpeg({ mozjpeg: true, quality: 50 })
    .toBuffer()
    .then(newWebpImg => {
      //changing the old jpg image buffer to new webp buffer
      foodImg.data = newWebpImg

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: foodImgName,
        Body: newWebpImg,
        ContentType: 'image/webp'
      } //uploading the new webp image to s3 bucket, self executing function
      ;(async () => {
        try {
          const { Location } = await s3.upload(params).promise()

          //saving the new image path to the database
          foods.foodImgDisplayPath = Location
          foods.foodImgDisplayName = Location.split('.com/')[1]
          await foods.save()

          res.json({
            message: 'Food added successfully',
            foodAdded: 1
          })
        } catch (error) {
          res.json({
            message: error,
            foodAdded: 0
          })
          return
        }
      })()
    })
    .catch(err => {
      res.json({
        message: `Sorry! Something went wrong, check the error => 😥: \n ${err}`,
        foodAdded: 0
      })
    })
})

const getFood = asyncHandler(async (req, res) => {
  res.json(res.paginatedResults)
})

const deleteFood = asyncHandler(async (req, res) => {
  const { prevFoodImgName } = req.body
  const { foodId } = req.params

  //delete the old image from s3 bucket
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: prevFoodImgName
  }

  try {
    await FoodsModel.findByIdAndDelete(foodId)

    s3.deleteObject(params, (err, data) => {
      if (err) {
        res.json({
          message: err,
          foodDeleted: 0
        })
        return
      }

      res.json({
        message: 'Food Deleted Successfully',
        foodDeleted: 1
      })
      return
    })
  } catch (error) {
    res.json({
      message: `Sorry! Something went wrong, check the error => 😥: \n ${error}`,
      foodDeleted: 0
    })
  }
})

const updateFood = asyncHandler(async (req, res) => {
  const {
    foodName,
    foodPrice,
    foodDesc,
    foodToppings,
    foodTags,
    category,
    prevFoodImgPath,
    prevFoodImgName
  } = req.body

  const toppings = foodToppings && foodToppings
  // const toppings = foodToppings && JSON.parse(foodToppings)
  const tags = foodTags && foodTags
  // const tags = JSON.parse(foodTags)
  const { foodId, imgId } = req.params
  const updatedAt = Date.now()

  const { foodImg } = req.files || ''
  const foodImgName = uuidv4() + foodImg?.name.split('.')[0] + '.webp' || ''
  let foodImgDisplayPath = prevFoodImgPath
  let foodImgDisplayName = prevFoodImgName

  //if the user has uploaded a new image
  if (foodImg) {
    //delete the old image from s3 bucket
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: foodImgDisplayName
    }
    s3.deleteObject(params, (err, data) => {
      if (err) {
        res.json({
          message: err,
          foodDeleted: 0
        })
        return
      }
    })

    //upload the new image to s3 bucket
    sharp(foodImg.data)
      .rotate()
      .resize(600)
      .jpeg({ mozjpeg: true, quality: 50 })
      .toBuffer()
      .then(newWebpImg => {
        //changing the old jpg image buffer to new webp buffer
        foodImg.data = newWebpImg

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: foodImgName,
          Body: newWebpImg,
          ContentType: 'image/webp'
        } //uploading the new webp image to s3 bucket, self executing function
        ;(async () => {
          try {
            const { Location } = await s3.upload(params).promise()

            //saving the new image path to the database
            foodImgDisplayPath = Location
            foodImgDisplayName = Location.split('.com/')[1]

            await FoodsModel.findByIdAndUpdate(foodId, {
              foodImgDisplayPath,
              foodImgDisplayName,
              foodName,
              foodPrice,
              category,
              foodDesc,
              foodToppings: toppings,
              foodTags: tags,
              updatedAt
            })

            res.json({
              message: 'Food Updated Successfully',
              foodUpdated: 1
            })
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
  } else {
    if (imgId) {
      //delete the old image from s3 bucket
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: prevFoodImgName
      }

      try {
        await FoodsModel.findOneAndUpdate(
          { _id: foodId },
          [
            {
              $set: {
                foodImgs: {
                  $reduce: {
                    input: '$foodImgs',
                    initialValue: [],
                    in: {
                      $concatArrays: [
                        '$$value',
                        [
                          {
                            $mergeObjects: [
                              { data: '$$this' },
                              { inx: { $size: '$$value' } }
                            ]
                          }
                        ]
                      ]
                    }
                  }
                }
              }
            },
            {
              $set: {
                foodImgs: {
                  $filter: {
                    input: '$foodImgs',
                    cond: { $ne: ['$$this.inx', parseInt(imgId)] }
                  }
                }
              }
            },
            { $set: { foodImgs: { $map: { input: '$foodImgs', in: '$$this.data' } } } }
          ],
          { new: true }
        )

        await s3.deleteObject(params).promise() //delete the image from the s3 bucket

        res.json({
          message: 'Food image deleted successfully',
          ImgDeleted: 1
        })
      } catch (error) {
        res.json({
          message: `Sorry! Something went wrong, check the error => 😥: \n ${error}`,
          ImgDeleted: 0
        })
      }
    } else {
      try {
        await FoodsModel.findByIdAndUpdate(foodId, {
          foodName,
          foodPrice,
          category,
          foodDesc,
          foodToppings: toppings,
          foodTags: tags,
          updatedAt
        })

        res.json({
          message: 'Food Updated Successfully',
          foodUpdated: 1
        })
      } catch (error) {
        res.json({
          message: `Sorry! Something went wrong, check the error => 😥: \n ${error}`,
          foodUpdated: 0
        })
      }
    }
  }
})

module.exports = { addFood, getFood, deleteFood, updateFood }
