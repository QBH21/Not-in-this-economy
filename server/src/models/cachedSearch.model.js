import crypto from 'crypto'
import { query } from '../config/database.js'
import { config } from '../config/env.js'

export const CachedSearchModel = {
  hashQuery(queryText) {
    return crypto.createHash('sha256').update(queryText.toLowerCase().trim()).digest('hex')
  },

  async find(queryText, apiSource) {
    const hash = this.hashQuery(queryText)
    const rows = await query(
      'SELECT * FROM cached_searches WHERE query_hash = ? AND api_source = ? AND expires_at > NOW()',
      [hash, apiSource]
    )
    if (rows[0]) {
      return typeof rows[0].results_json === 'string'
        ? JSON.parse(rows[0].results_json)
        : rows[0].results_json
    }
    return null
  },

  async save(queryText, apiSource, results) {
    const hash = this.hashQuery(queryText)
    const ttl = config.cache.searchTTL
    await query(
      `INSERT INTO cached_searches (query_hash, query_text, api_source, results_json, result_count, expires_at)
       VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND))
       ON DUPLICATE KEY UPDATE results_json = VALUES(results_json), result_count = VALUES(result_count), expires_at = VALUES(expires_at)`,
      [hash, queryText, apiSource, JSON.stringify(results), results.length, ttl]
    )
  },

  async cleanup() {
    await query('DELETE FROM cached_searches WHERE expires_at < NOW()')
  },
}
