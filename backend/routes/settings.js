import express from 'express'
import { updateSettings, getSettings } from '../controllers/settings.js'

const router = express.Router()

router.patch('/:id', updateSettings)
router.get('/', getSettings)

export default router
