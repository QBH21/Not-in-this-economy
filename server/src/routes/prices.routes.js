import { Router } from 'express'
import { priceLimiter } from '../middleware/rateLimiter.js'
import { requireAuth } from '../middleware/auth.js'
import * as ctrl from '../controllers/prices.controller.js'

const router = Router()

router.use(priceLimiter)
router.get('/:productId', ctrl.getProductPrices)
router.post('/check-list/:listId', requireAuth, ctrl.checkListPrices)

export default router
