import { Router } from 'express'
import { validate, schemas } from '../middleware/validateRequest.js'
import { generalLimiter } from '../middleware/rateLimiter.js'
import { requireAuth } from '../middleware/auth.js'
import * as ctrl from '../controllers/shoppingList.controller.js'

const router = Router()

router.use(generalLimiter)
router.use(requireAuth)

router.get('/', ctrl.getLists)
router.post('/', validate(schemas.createList), ctrl.createList)
router.get('/:id', ctrl.getList)
router.put('/:id', validate(schemas.updateList), ctrl.updateList)
router.delete('/:id', ctrl.deleteList)
router.post('/:id/items', validate(schemas.addItem), ctrl.addItem)
router.put('/:id/items/:itemId', validate(schemas.updateItem), ctrl.updateItem)
router.delete('/:id/items/:itemId', ctrl.deleteItem)

export default router
