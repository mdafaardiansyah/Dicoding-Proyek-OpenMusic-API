const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator, cacheService) {
    this._service = service;
    this._validator = validator;
    this._cacheService = cacheService;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this._service.addUser({
      username,
      password,
      fullname,
    });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request, h) {
    const { id } = request.params;
    const cacheKey = `user:${id}`;

    try {
      const result = await this._cacheService.get(cacheKey);
      const user = JSON.parse(result);

      const response = h.response({
        status: 'success',
        data: {
          user,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (cacheError) {
      const user = await this._service.getUserById(id);
      await this._cacheService.set(cacheKey, JSON.stringify(user), 1800); // 30 minutes

      const response = h.response({
        status: 'success',
        data: {
          user,
        },
      });
      response.header('X-Data-Source', 'database');
      return response;
    }
  }
}

module.exports = UsersHandler;