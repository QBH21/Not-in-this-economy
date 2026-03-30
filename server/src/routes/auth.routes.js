import { Router } from 'express'
import { validate, schemas } from '../middleware/validateRequest.js'
import { generalLimiter } from '../middleware/rateLimiter.js'
import { requireAuth } from '../middleware/auth.js'
import * as ctrl from '../controllers/auth.controller.js'

const router = Router()

router.use(generalLimiter)

router.post('/register', validate(schemas.register), ctrl.register)
router.post('/login', validate(schemas.login), ctrl.login)
router.get('/me', requireAuth, ctrl.getMe)

export default router
