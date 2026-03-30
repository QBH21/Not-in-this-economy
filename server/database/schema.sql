-- For local: creates the database. On Railway: use the existing 'railway' database.
CREATE DATABASE IF NOT EXISTS not_in_this_economy
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE not_in_this_economy;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS shopping_lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL DEFAULT 'My List',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

CREATE TABLE IF NOT EXISTS shopping_list_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  list_id INT NOT NULL,
  product_name VARCHAR(500) NOT NULL,
  quantity INT DEFAULT 1,
  notes TEXT,
  best_price DECIMAL(10, 2) DEFAULT NULL,
  best_store VARCHAR(255) DEFAULT NULL,
  best_deal_url VARCHAR(2048) DEFAULT NULL,
  last_price_check TIMESTAMP NULL,
  is_purchased BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (list_id) REFERENCES shopping_lists(id) ON DELETE CASCADE,
  INDEX idx_list_id (list_id)
);

CREATE TABLE IF NOT EXISTS cached_searches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query_hash CHAR(64) NOT NULL,
  query_text VARCHAR(500) NOT NULL,
  api_source VARCHAR(20) NOT NULL,
  results_json JSON NOT NULL,
  result_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  UNIQUE INDEX idx_query_source (query_hash, api_source),
  INDEX idx_expires (expires_at)
);

CREATE TABLE IF NOT EXISTS cached_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_identifier VARCHAR(500) NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  product_url VARCHAR(2048),
  image_url VARCHAR(2048),
  in_stock BOOLEAN DEFAULT TRUE,
  api_source VARCHAR(20) NOT NULL,
  fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  INDEX idx_product (product_identifier(100)),
  INDEX idx_expires (expires_at)
);

CREATE TABLE IF NOT EXISTS api_usage_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  api_source VARCHAR(20) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  called_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_status INT,
  response_time_ms INT,
  INDEX idx_source_date (api_source, called_at)
);
