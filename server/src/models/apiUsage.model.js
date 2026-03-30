import { query } from '../config/database.js'

const MONTHLY_LIMITS = {
  serper: 2500,
}

export const ApiUsageModel = {
  async log(apiSource, endpoint, responseStatus, responseTimeMs) {
    await query(
      'INSERT INTO api_usage_log (api_source, endpoint, response_status, response_time_ms) VALUES (?, ?, ?, ?)',
      [apiSource, endpoint, responseStatus, responseTimeMs]
    )
  },

  async getMonthlyCount(apiSource) {
    const rows = await query(
      `SELECT COUNT(*) as count FROM api_usage_log
       WHERE api_source = ? AND called_at >= DATE_FORMAT(NOW(), '%Y-%m-01')`,
      [apiSource]
    )
    return rows[0]?.count || 0
  },

  async canUse(apiSource) {
    const limit = MONTHLY_LIMITS[apiSource]
    if (!limit) return true
    const count = await this.getMonthlyCount(apiSource)
    return count < limit
  },

  async getUsageStats() {
    const stats = {}
    for (const source of Object.keys(MONTHLY_LIMITS)) {
      const count = await this.getMonthlyCount(source)
      stats[source] = {
        used: count,
        limit: MONTHLY_LIMITS[source],
        remaining: Math.max(0, MONTHLY_LIMITS[source] - count),
      }
    }
    return stats
  },
}
