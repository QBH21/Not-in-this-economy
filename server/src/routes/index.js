import { Router } from 'express'
import authRoutes from './auth.routes.js'
import shoppingListRoutes from './shoppingList.routes.js'
import searchRoutes from './search.routes.js'
import pricesRoutes from './prices.routes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/lists', shoppingListRoutes)
router.use('/search', searchRoutes)
router.use('/prices', pricesRoutes)

export default router
