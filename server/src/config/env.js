import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Load .env from project root
dotenv.config({ path: resolve(__dirname, '../../../.env') })

export const config = {
  port: parseInt(process.env.PORT || '3400', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'not_in_this_economy',
  },

  jwtSecret: process.env.JWT_SECRET || 'not-in-this-economy-dev-secret-change-me',

  apis: {
    serper: process.env.SERPER_API_KEY || '',
  },

  cache: {
    searchTTL: parseInt(process.env.SEARCH_CACHE_TTL || '21600', 10),
    priceTTL: parseInt(process.env.PRICE_CACHE_TTL || '7200', 10),
  },
}
