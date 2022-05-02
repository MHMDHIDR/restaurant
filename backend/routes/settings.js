const express = require('express')
const router = express.Router()
const { updateSettings, getSettings } = require(`${__dirname}/../controllers/settings.js`)

router.patch('/:id', updateSettings)
router.get('/', getSettings)

module.exports = router
