import express from 'express'
import { getProfile, updateProfile } from '../controllers/profile.controller'

const router = express.Router()

router.route('/:task_id').get(getProfile).put(updateProfile)


export default router