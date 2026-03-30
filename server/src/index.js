import app from './app.js'
import { config } from './config/env.js'
import { testConnection } from './config/database.js'
import { logger } from './utils/logger.js'

async function start() {
  const dbConnected = await testConnection()
  if (dbConnected) {
    logger.info('MySQL connected successfully')
  } else {
    logger.warn('MySQL not available - running without database (shopping lists will not persist)')
  }

  app.listen(config.port, () => {
    logger.info(`Server running on http://localhost:${config.port}`)
    logger.info(`Environment: ${config.nodeEnv}`)

    const apis = []
    if (config.apis.serpapi) apis.push('SerpAPI')
    if (config.apis.rapidapi) apis.push('RapidAPI')
    if (config.apis.bestbuy) apis.push('Best Buy')
    logger.info(`Active APIs: ${apis.length > 0 ? apis.join(', ') : 'None configured (add keys to .env)'}`)
  })
}

start()
