import express from 'express'
import { getToken, signin, signup } from '../controllers/auth.controller'

const router = express.Router()

router.route('/').get(getToken)
router.route('/signin').post(signin)
router.route('/signup').post(signup)

export default router