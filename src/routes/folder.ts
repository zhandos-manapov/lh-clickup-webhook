import express from 'express'
import { getLists } from '../controllers/list'

const router = express.Router()

// List
router.route('/:folder_id/list').get(getLists)

export default router