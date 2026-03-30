import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

// Only apply helmet & cors to API routes (not Next.js pages)
app.use('/api', helmet())
app.use('/api', cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Not in this economy', timestamp: new Date().toISOString() })
})

app.use('/api', routes)

app.use('/api/*', notFound)
app.use(errorHandler)

export default app
