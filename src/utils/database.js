/**
 * Database configuration dan connection pool untuk PostgreSQL
 * Menggunakan pg (node-postgres) untuk koneksi ke database
 */

const { Pool } = require('pg');
const config = require('./config');

/**
 * Konfigurasi connection pool PostgreSQL
 * Menggunakan environment variables untuk konfigurasi database
 */
const pool = new Pool({
  user: config.database.user || 'postgres',
  host: config.database.host || 'localhost',
  database: config.database.database || 'openmusic',
  password: config.database.password || 'password',
  port: config.database.port || 5432,
  // Konfigurasi connection pool
  max: 20, // Maksimal 20 koneksi dalam pool
  idleTimeoutMillis: 30000, // Timeout untuk koneksi idle (30 detik)
  connectionTimeoutMillis: 2000, // Timeout untuk membuat koneksi baru (2 detik)
});

/**
 * Event listener untuk monitoring koneksi database
 */
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * Fungsi untuk test koneksi database
 * @returns {Promise<boolean>} - True jika koneksi berhasil
 */
const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('Database connection test successful');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
};