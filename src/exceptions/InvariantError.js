const ClientError = require('./ClientError');

/**
 * InvariantError - Error untuk validasi data yang gagal
 * Digunakan ketika data yang dikirim client tidak sesuai dengan aturan validasi
 * Status code: 400 Bad Request
 */
class InvariantError extends ClientError {
  /**
   * Constructor untuk InvariantError
   * @param {string} message - Pesan error validasi
   */
  constructor(message) {
    super(message, 400);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;