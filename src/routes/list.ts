import express from 'express'
import { getProfileFields, getProfiles } from '../controllers/profile'

const router = express.Router()

router.route('/:list_id/field').get(getProfileFields)
router.route('/:list_id/task').get(getProfiles)

export default router