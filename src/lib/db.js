import mysql from "mysql2/promise";

/**
 * Database connection configuration
 * Creates a connection pool for better performance and connection management
 */
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
};

// Create connection pool
let pool = null;

/**
 * Get database connection from pool
 * @returns {Promise<Connection>} Database connection
 * @throws {Error} If connection fails
 */
export async function connectDB() {
  try {
    if (!pool) {
      pool = mysql.createPool(dbConfig);
    }

    const connection = await pool.getConnection();

    // Test the connection
    await connection.ping();

    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error(`Failed to connect to database: ${error.message}`);
  }
}

/**
 * Close database connection pool
 * Should be called when shutting down the application
 */
export async function closeDB() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}