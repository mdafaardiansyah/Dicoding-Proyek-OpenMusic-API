/**
 * Index file untuk mengekspor semua utilities
 * Memudahkan import utilities dari satu tempat
 */

const { pool, testConnection } = require('./database');

module.exports = {
  pool,
  testConnection,
};