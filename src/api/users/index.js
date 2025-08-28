const UsersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { service, validator, cacheService }) => {
    const usersHandler = new UsersHandler(service, validator, cacheService);
    server.route(routes(usersHandler));
  },
};