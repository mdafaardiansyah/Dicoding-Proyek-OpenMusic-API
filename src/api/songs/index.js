/**
 * Songs API Plugin - Plugin Hapi.js untuk Songs API
 * Mengintegrasikan handler, routes, service, dan validator
 */

const SongsHandler = require('./handler');
const routes = require('./routes');

/**
 * Plugin Songs API untuk Hapi.js
 */
module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service, validator, cacheService }) => {
    // Inisialisasi handler dengan service, validator, dan cacheService
    const songsHandler = new SongsHandler(service, validator, cacheService);

    // Daftarkan routes ke server
    server.route(routes(songsHandler));
  },
};