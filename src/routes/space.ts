import express from 'express'
import { getFolders } from '../controllers/folder'
import { getFolderlessLists } from '../controllers/list'

const router = express.Router()

// Folder
router.route('/:space_id/folder').get(getFolders)
router.route('/:space_id/list').get(getFolderlessLists)

export default router