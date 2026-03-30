import { query } from '../config/database.js'

export const UserModel = {
  async findByEmail(email) {
    const rows = await query('SELECT * FROM users WHERE email = ?', [email])
    return rows[0] || null
  },

  async findById(id) {
    const rows = await query('SELECT id, name, email, created_at FROM users WHERE id = ?', [id])
    return rows[0] || null
  },

  async create(name, email, passwordHash) {
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, passwordHash]
    )
    return { id: result.insertId, name, email, created_at: new Date() }
  },
}
