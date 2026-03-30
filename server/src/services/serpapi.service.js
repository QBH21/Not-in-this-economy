import axios from 'axios'
import { config } from '../config/env.js'
import { ApiUsageModel } from '../models/apiUsage.model.js'
import { logger } from '../utils/logger.js'

const SERPER_URL = 'https://google.serper.dev/shopping'

export async function searchShopping(queryText, num = 20) {
  if (!config.apis.serper) {
    logger.warn('Serper API key not configured')
    return []
  }

  const canUse = await ApiUsageModel.canUse('serper')
  if (!canUse) {
    logger.warn('Serper monthly limit reached')
    return []
  }

  const start = Date.now()
  try {
    const response = await axios.post(
      SERPER_URL,
      { q: queryText, gl: 'us', hl: 'en', num, autocorrect: true },
      {
        headers: {
          'X-API-KEY': config.apis.serper,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    )

    const elapsed = Date.now() - start
    await ApiUsageModel.log('serper', 'shopping', response.status, elapsed)

    const items = response.data?.shopping || []
    return items.map((item) => normalizeSerperProduct(item))
  } catch (err) {
    const elapsed = Date.now() - start
    await ApiUsageModel.log('serper', 'shopping', err.response?.status || 500, elapsed)
    logger.error('Serper API error:', err.message)
    return []
  }
}

function normalizeSerperProduct(item) {
  return {
    id: `serper_${item.productId || item.position || Math.random().toString(36).slice(2)}`,
    name: item.title || 'Unknown Product',
    price: parsePrice(item.price),
    currency: 'USD',
    store: item.source || 'Unknown Store',
    productUrl: item.link || null,
    imageUrl: item.imageUrl || null,
    rating: item.rating || null,
    reviewCount: item.ratingCount || null,
    shipping: formatDelivery(item.delivery),
    offers: item.offers || null,
    condition: 'New',
    source: 'serper',
  }
}

function parsePrice(value) {
  if (value == null) return null
  if (typeof value === 'number') return value
  const cleaned = String(value).replace(/[^0-9.]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

function formatDelivery(delivery) {
  if (!delivery) return null
  if (typeof delivery === 'string') return delivery
  // Serper returns delivery as an object like { price: "Free", by: "Wed, Apr 2" }
  if (typeof delivery === 'object') {
    const parts = []
    if (delivery.price) parts.push(delivery.price === 'Free' ? 'Free Shipping' : `Shipping: ${delivery.price}`)
    if (delivery.by) parts.push(`by ${delivery.by}`)
    return parts.join(' ') || null
  }
  return null
}
