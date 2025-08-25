/**
 * Albums API Plugin - Plugin Hapi.js untuk Albums API
 * Mengintegrasikan handler, routes, service, dan validator
 */

const AlbumsHandler = require('./handler');
const routes = require('./routes');

/**
 * Plugin Albums API untuk Hapi.js
 */
module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, validator, songsService }) => {
    // Inisialisasi handler dengan service, validator, dan songsService
    const albumsHandler = new AlbumsHandler(service, validator, songsService);

    // Daftarkan routes ke server
    server.route(routes(albumsHandler));
  },
};