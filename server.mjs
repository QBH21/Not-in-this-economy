import { parse } from 'url'
import next from 'next'
import { config } from './server/src/config/env.js'
import { testConnection } from './server/src/config/database.js'
import expressApp from './server/src/app.js'
import { logger } from './server/src/utils/logger.js'

const dev = process.env.NODE_ENV !== 'production'
const port = config.port

const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

async function start() {
  await nextApp.prepare()

  const dbConnected = await testConnection()
  if (dbConnected) {
    logger.info('MySQL connected successfully')
  } else {
    logger.warn('MySQL not available - running without database')
  }

  const apis = []
  if (config.apis.serper) apis.push('Serper.dev (Google Shopping)')

  // Let Express handle /api routes, Next.js handles everything else
  expressApp.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true)
    nextHandler(req, res, parsedUrl)
  })

  expressApp.listen(port, () => {
    logger.info(`Running on http://localhost:${port}`)
    logger.info(`Environment: ${config.nodeEnv}`)
    logger.info(`Active APIs: ${apis.length > 0 ? apis.join(', ') : 'None configured'}`)
  })
}

start().catch((err) => {
  console.error('Failed to start:', err)
  process.exit(1)
})
