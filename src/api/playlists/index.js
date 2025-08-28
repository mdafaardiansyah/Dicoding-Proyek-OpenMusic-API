const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, validator, cacheService }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator, cacheService);
    server.route(routes(playlistsHandler));
  },
};