import { Router } from 'express'
import { validate, schemas } from '../middleware/validateRequest.js'
import { searchLimiter } from '../middleware/rateLimiter.js'
import * as ctrl from '../controllers/search.controller.js'

const router = Router()

router.use(searchLimiter)
router.get('/', validate(schemas.searchQuery, 'query'), ctrl.search)

export default router
