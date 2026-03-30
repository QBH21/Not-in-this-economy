import { query } from '../config/database.js'

export const ShoppingListModel = {
  async findAll(userId) {
    return query('SELECT * FROM shopping_lists WHERE user_id = ? ORDER BY updated_at DESC', [userId])
  },

  async findById(id, userId) {
    const rows = await query('SELECT * FROM shopping_lists WHERE id = ? AND user_id = ?', [id, userId])
    return rows[0] || null
  },

  async create(name, userId) {
    const result = await query('INSERT INTO shopping_lists (name, user_id) VALUES (?, ?)', [name, userId])
    return { id: result.insertId, name, user_id: userId, created_at: new Date(), updated_at: new Date() }
  },

  async update(id, name, userId) {
    await query('UPDATE shopping_lists SET name = ? WHERE id = ? AND user_id = ?', [name, id, userId])
    return this.findById(id, userId)
  },

  async delete(id, userId) {
    await query('DELETE FROM shopping_lists WHERE id = ? AND user_id = ?', [id, userId])
  },

  async getItems(listId) {
    return query(
      'SELECT * FROM shopping_list_items WHERE list_id = ? ORDER BY is_purchased ASC, created_at DESC',
      [listId]
    )
  },

  async addItem(listId, { product_name, quantity = 1, notes = '' }) {
    const result = await query(
      'INSERT INTO shopping_list_items (list_id, product_name, quantity, notes) VALUES (?, ?, ?, ?)',
      [listId, product_name, quantity, notes]
    )
    return {
      id: result.insertId,
      list_id: listId,
      product_name,
      quantity,
      notes,
      best_price: null,
      best_store: null,
      best_deal_url: null,
      is_purchased: false,
      created_at: new Date(),
    }
  },

  async updateItem(itemId, updates) {
    const fields = []
    const values = []
    for (const [key, value] of Object.entries(updates)) {
      if (['quantity', 'notes', 'is_purchased', 'best_price', 'best_store', 'best_deal_url', 'last_price_check'].includes(key)) {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    }
    if (fields.length === 0) return null
    values.push(itemId)
    await query(`UPDATE shopping_list_items SET ${fields.join(', ')} WHERE id = ?`, values)
    const rows = await query('SELECT * FROM shopping_list_items WHERE id = ?', [itemId])
    return rows[0] || null
  },

  async deleteItem(itemId) {
    await query('DELETE FROM shopping_list_items WHERE id = ?', [itemId])
  },
}
