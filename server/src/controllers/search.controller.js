import { searchAllStores } from '../services/priceAggregator.service.js'

export async function search(req, res, next) {
  try {
    const { q, min_price, max_price } = req.query
    let products = await searchAllStores(q)

    if (min_price != null) {
      products = products.filter((p) => p.price >= parseFloat(min_price))
    }
    if (max_price != null) {
      products = products.filter((p) => p.price <= parseFloat(max_price))
    }

    res.json({ query: q, count: products.length, products })
  } catch (err) {
    next(err)
  }
}
