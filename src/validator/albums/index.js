/**
 * Albums Validator
 * Mengekspor fungsi validasi untuk albums menggunakan Joi schema
 */

const { AlbumPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * Validator untuk albums
 */
const AlbumsValidator = {
  /**
   * Validasi payload untuk create dan update album
   * @param {Object} payload - Data album yang akan divalidasi
   * @throws {InvariantError} - Jika validasi gagal
   */
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;