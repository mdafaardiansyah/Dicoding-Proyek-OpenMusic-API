/**
 * Index file untuk mengekspor semua validators
 * Memudahkan import validators dari satu tempat
 */

const AlbumsValidator = require('./albums');
const SongsValidator = require('./songs');

module.exports = {
  AlbumsValidator,
  SongsValidator,
};