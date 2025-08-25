const ClientError = require('./ClientError');

/**
 * NotFoundError - Error untuk resource yang tidak ditemukan
 * Digunakan ketika client mencari data yang tidak ada di database
 * Status code: 404 Not Found
 */
class NotFoundError extends ClientError {
  /**
   * Constructor untuk NotFoundError
   * @param {string} message - Pesan error not found
   */
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;