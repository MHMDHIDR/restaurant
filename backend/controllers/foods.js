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
  const foodImgs = foodImg && Array.isArray(foodImg) ? foodImg : [foodImg]
  const foodImgNames = foodImgs?.map(img => uuidv4() + img.name.split('.')[0] + '.webp')

  let foodImgDisplayPath, foodImgDisplayName

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

            //save food into database
            await FoodsModel.create({
              foodName,
              foodPrice,
              category,
              foodDesc,
              foodToppings: toppings,
              foodTags: tags,
              foodImgs: foodImgs.map(img => {
                return {
                  foodImgDisplayName: foodImgNames[index],
                  foodImgDisplayPath: Location
                }
              })
            })

            res.json({
              message: 'Food added successfully',
              foodAdded: 1
            })
            return
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
})

const getFood = asyncHandler(async (req, res) => {
  res.json(res.paginatedResults)
})

const deleteFood = asyncHandler((req, res) => {
  const prevFoodImgPathsAndNames = JSON.parse(req.body.prevFoodImgPathsAndNames)
  const { foodId } = req.params

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
          foodUpdated: 0
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
})

const updateFood = asyncHandler(async (req, res) => {
  const { foodName, foodPrice, foodDesc, foodToppings, foodTags, category } = req.body
  const prevFoodImgPathsAndNames = JSON.parse(req.body.prevFoodImgPathsAndNames)

  const toppings = foodToppings && JSON.parse(foodToppings)
  const tags = JSON.parse(foodTags)
  const { foodId } = req.params
  const updatedAt = Date.now()

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
    const Objects = prevFoodImgPathsAndNames.map(({ foodImgDisplayName }) => ({
      Key: foodImgDisplayName
    }))

    s3.deleteObjects(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: { Objects }
      },
      (error, data) => {
        if (error) {
          res.json({
            message: error,
            foodUpdated: 0
          })
          return
        }

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
                        updatedAt
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
      }
    )
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
        updatedAt
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

module.exports = { addFood, getFood, deleteFood, updateFood }
