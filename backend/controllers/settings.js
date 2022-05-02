const mongoose = require('mongoose')
const SettingsModel = require(`${__dirname}/../models/settings-model.js`)

const updateSettings = async (req, res) => {
  const _id = req.params.id
  const { appDesc, appTagline, CategoryList } = req.body
  const categories = JSON.parse(CategoryList)

  //if not valid _id then return error message
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.json({ message: `Sorry, No settings with this ID => ${_id}` })
  }

  //else do this
  try {
    await SettingsModel.findByIdAndUpdate(_id, {
      appDesc,
      appTagline,
      CategoryList: categories
    })

    res.json({ message: 'تم تحديث الإعدادات بنجاح', settingUpdated: 1 })
  } catch (error) {
    res.json({
      message: `Sorry! Something went wrong, check the error => 😥: \n ${error}`,
      settingUpdated: 0
    })
  }
}

const getSettings = async (req, res) => {
  try {
    const settings = await SettingsModel.findOne({ _id: '6210bdda057555eb91c05efb' })
    res.header('Access-Control-Allow-Origin', '*')
    res.status(200).json(settings)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

module.exports = { updateSettings, getSettings }
