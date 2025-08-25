/**
 * Songs Validator
 * Mengekspor fungsi validasi untuk songs menggunakan Joi schema
 */

const { SongPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

/**
 * Validator untuk songs
 */
const SongsValidator = {
  /**
   * Validasi payload untuk create dan update song
   * @param {Object} payload - Data song yang akan divalidasi
   * @throws {InvariantError} - Jika validasi gagal
   */
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;