import express from 'express'

import { authController } from './auth.controller'
import { validateRequest } from '../../middleware/validateRequest'
import { loginValidationSchema } from './auth.validation'


const router = express.Router()


router.post('/login', validateRequest(loginValidationSchema) , authController.login)

export const authRoutes = router





