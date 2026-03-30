import { searchShopping } from './serpapi.service.js'
import { CachedSearchModel } from '../models/cachedSearch.model.js'
import { logger } from '../utils/logger.js'

export async function searchAllStores(queryText) {
  // Check cache first
  const cached = await CachedSearchModel.find(queryText, 'serper')
  if (cached) {
    logger.info(`Cache hit for "${queryText}"`)
    return deduplicateAndMerge(cached)
  }

  // Fetch from Serper (Google Shopping - aggregates all stores)
  const results = await searchShopping(queryText)

  if (results.length > 0) {
    await CachedSearchModel.save(queryText, 'serper', results)
  }

  logger.info(`Search "${queryText}" returned ${results.length} results from Google Shopping`)
  return deduplicateAndMerge(results)
}

function deduplicateAndMerge(products) {
  const valid = products.filter((p) => p && p.name && p.price != null)

  const seen = new Map()
  const deduped = []

  for (const product of valid) {
    const key = `${product.store?.toLowerCase()}_${product.name?.toLowerCase().slice(0, 50)}`
    if (!seen.has(key)) {
      seen.set(key, true)
      deduped.push(product)
    }
  }

  return deduped
}

export async function findBestDeal(queryText) {
  const products = await searchAllStores(queryText)
  if (products.length === 0) return null

  const sorted = products.sort((a, b) => (a.price || Infinity) - (b.price || Infinity))
  return sorted[0]
}
