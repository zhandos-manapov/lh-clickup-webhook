import express from 'express'
import { getTeams } from '../controllers/team'
import { getSpaces } from '../controllers/space'

const router = express.Router()

// Team
router.route('/').get(getTeams)

// Space
router.route('/:team_id/space').get(getSpaces)


export default router