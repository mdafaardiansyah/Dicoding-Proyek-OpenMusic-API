/**
 * Index file untuk mengekspor semua services
 * Memudahkan import services dari satu tempat
 */

const AlbumsService = require('./AlbumsService');
const SongsService = require('./SongsService');

module.exports = {
  AlbumsService,
  SongsService,
};