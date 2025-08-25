/**
 * ClientError - Base class untuk semua client errors
 * Digunakan sebagai parent class untuk error yang disebabkan oleh client
 * seperti bad request, not found, dll.
 */
class ClientError extends Error {
  /**
   * Constructor untuk ClientError
   * @param {string} message - Pesan error yang akan ditampilkan
   * @param {number} statusCode - HTTP status code (default: 400)
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;