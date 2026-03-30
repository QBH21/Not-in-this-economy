import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    const url = process.env.MYSQL_PUBLIC_URL;
    if (url) {
      pool = mysql.createPool({
        uri: url,
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
      });
    } else {
      pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "3306", 10),
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "not_in_this_economy",
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
      });
    }
  }
  return pool;
}

export async function query(sql: string, params?: (string | number | boolean | null)[]) {
  const [rows] = await getPool().execute(sql, params);
  return rows as Record<string, unknown>[];
}
