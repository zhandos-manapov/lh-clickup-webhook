import express from 'express'
import { createProfile } from '../controllers/profile'

const router = express.Router()

router.route('/').post(createProfile)

export default router