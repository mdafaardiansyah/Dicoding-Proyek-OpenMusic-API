/**
 * Albums Validator
 * Mengekspor fungsi validasi untuk albums menggunakan Joi schema
 */

const { AlbumPayloadSchema } = require('./schema');
const { ImageHeadersSchema, ImagePayloadSchema } = require('../uploads/schema');
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

  /**
   * Validasi headers untuk upload image
   * @param {Object} headers - Headers dari file yang diupload
   * @throws {InvariantError} - Jika validasi gagal
   */
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  /**
   * Validasi payload untuk upload image
   * @param {Object} payload - Payload dari file yang diupload
   * @throws {InvariantError} - Jika validasi gagal
   */
  validateImagePayload: (payload) => {
    const validationResult = ImagePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;