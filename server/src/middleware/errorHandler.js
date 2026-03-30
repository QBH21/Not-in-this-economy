import { logger } from '../utils/logger.js'

export function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack, path: req.path })

  const status = err.status || 500
  const message = status === 500 ? 'Internal server error' : err.message

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Endpoint not found' })
}
