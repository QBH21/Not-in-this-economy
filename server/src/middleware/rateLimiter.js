import rateLimit from 'express-rate-limit'

export const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many searches. Even bargain hunters need to breathe.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const priceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: 'Slow down! The prices aren\'t going anywhere. (Unfortunately.)' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Rate limit exceeded. Try again shortly.' },
  standardHeaders: true,
  legacyHeaders: false,
})
