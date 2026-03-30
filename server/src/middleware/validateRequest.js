import Joi from 'joi'

export function validate(schema, property = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true })
    if (error) {
      const messages = error.details.map((d) => d.message)
      return res.status(400).json({ error: 'Validation failed', details: messages })
    }
    req[property] = value
    next()
  }
}

export const schemas = {
  createList: Joi.object({
    name: Joi.string().trim().min(1).max(255).required(),
  }),
  updateList: Joi.object({
    name: Joi.string().trim().min(1).max(255).required(),
  }),
  addItem: Joi.object({
    product_name: Joi.string().trim().min(1).max(500).required(),
    quantity: Joi.number().integer().min(1).max(999).default(1),
    notes: Joi.string().trim().max(1000).allow('').default(''),
  }),
  updateItem: Joi.object({
    quantity: Joi.number().integer().min(1).max(999),
    notes: Joi.string().trim().max(1000).allow(''),
    is_purchased: Joi.boolean(),
  }).min(1),
  searchQuery: Joi.object({
    q: Joi.string().trim().min(1).max(200).required(),
    sort: Joi.string().valid('price_asc', 'price_desc', 'rating', 'relevance').default('relevance'),
    min_price: Joi.number().min(0),
    max_price: Joi.number().min(0),
  }),
  register: Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().required(),
  }),
}