import { searchAllStores, findBestDeal } from '../services/priceAggregator.service.js'
import { ShoppingListModel } from '../models/shoppingList.model.js'

export async function getProductPrices(req, res, next) {
  try {
    const { productId } = req.params
    // productId is the product name (URL encoded)
    const productName = decodeURIComponent(productId)
    const products = await searchAllStores(productName)

    const product = products[0] || null
    res.json({ product, prices: products })
  } catch (err) {
    next(err)
  }
}

export async function checkListPrices(req, res, next) {
  try {
    const { listId } = req.params
    const items = await ShoppingListModel.getItems(listId)

    const updatedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const best = await findBestDeal(item.product_name)
          if (best) {
            await ShoppingListModel.updateItem(item.id, {
              best_price: best.price,
              best_store: best.store,
              best_deal_url: best.productUrl,
              last_price_check: new Date(),
            })
            return {
              ...item,
              best_price: best.price,
              best_store: best.store,
              best_deal_url: best.productUrl,
              last_price_check: new Date(),
            }
          }
        } catch {
          // skip failed items
        }
        return item
      })
    )

    res.json(updatedItems)
  } catch (err) {
    next(err)
  }
}
