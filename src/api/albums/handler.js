/**
 * Albums Handler - Handler untuk menangani request API albums
 * Menggunakan auto-bind untuk binding method context
 */

const autoBind = require('auto-bind');
const config = require('../../utils/config');

/**
 * Handler class untuk Albums API
 */
class AlbumsHandler {
  /**
   * Constructor untuk AlbumsHandler
   * @param {Object} service - Instance dari AlbumsService
   * @param {Object} validator - Instance dari AlbumsValidator
   * @param {Object} songsService - Instance dari SongsService
   * @param {Object} storageService - Instance dari StorageService
   * @param {Object} cacheService - Instance dari CacheService
   */
  constructor(service, validator, songsService, storageService, cacheService) {
    this._service = service;
    this._validator = validator;
    this._songsService = songsService;
    this._storageService = storageService;
    this._cacheService = cacheService;

    // Auto-bind semua method untuk mempertahankan context 'this'
    autoBind(this);
  }

  /**
   * Handler untuk POST /albums - Menambahkan album baru
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response dengan status 201 dan albumId
   */
  async postAlbumHandler(request, h) {
    // Validasi payload request
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;

    // Tambahkan album ke database
    const albumId = await this._service.addAlbum({ name, year });

    // Invalidate cache untuk albums
    await this._cacheService.delete(`album:${albumId}`);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * Handler untuk GET /albums/{id} - Mendapatkan album berdasarkan ID
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response dengan data album
   */
  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const cacheKey = `album:${id}`;

    try {
      const result = await this._cacheService.get(cacheKey);
      const album = JSON.parse(result);

      const response = h.response({
        status: 'success',
        data: {
          album,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (cacheError) {
      // Ambil data album dari database
      const album = await this._service.getAlbumById(id);

      // Ambil songs yang ada dalam album
      const songs = await this._songsService.getSongsByAlbumId(id);

      // Tambahkan songs ke dalam album
      album.songs = songs;
      await this._cacheService.set(cacheKey, JSON.stringify(album), 1800); // 30 minutes

      const response = h.response({
        status: 'success',
        data: {
          album,
        },
      });
      response.header('X-Data-Source', 'database');
      return response;
    }
  }

  /**
   * Handler untuk POST /albums/{id}/covers - Upload cover album
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response success message
   */
  async postUploadImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id } = request.params;

      console.log('Upload request received for album:', id);
      console.log('Cover object:', cover);
      console.log('Cover hapi headers:', cover.hapi.headers);

      // Validasi MIME type
      this._validator.validateImageHeaders(cover.hapi.headers);

      // Validasi ukuran file - gunakan Buffer.byteLength atau cover._data.length
      const fileSize = Buffer.isBuffer(cover._data) ? cover._data.length : Buffer.byteLength(cover._data);
      console.log('File size:', fileSize);
      this._validator.validateImagePayload({ size: fileSize });

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      const coverUrl = `http://${config.app.host}:${config.app.port}/uploads/${filename}`;

      await this._service.addAlbumCover(id, coverUrl);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      });
      response.code(201);
      return response;
    } catch (error) {
      console.error('Error in postUploadImageHandler:', error);

      // Handle storage errors
      if (error.message.includes('Ukuran file melebihi') ||
          error.message.includes('Gagal menyimpan file') ||
          error.message.includes('Error saat membaca file')) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(400);
        return response;
      }
      throw error;
    }
  }

  /**
   * Handler untuk POST /albums/{id}/likes - Like album
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response success message
   */
  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.addAlbumLike(userId, albumId);
    await this._cacheService.delete(`album_likes:${albumId}`);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil disukai',
    });
    response.code(201);
    return response;
  }

  /**
   * Handler untuk DELETE /albums/{id}/likes - Unlike album
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response success message
   */
  async deleteAlbumLikeHandler(request) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.deleteAlbumLike(userId, albumId);
    await this._cacheService.delete(`album_likes:${albumId}`);

    return {
      status: 'success',
      message: 'Album batal disukai',
    };
  }

  /**
   * Handler untuk GET /albums/{id}/likes - Get album likes count
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response dengan jumlah likes
   */
  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const cacheKey = `album_likes:${albumId}`;

    try {
      const result = await this._cacheService.get(cacheKey);
      const likes = JSON.parse(result);

      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (cacheError) {
      const likes = await this._service.getAlbumLikes(albumId);
      await this._cacheService.set(cacheKey, JSON.stringify(likes), 1800); // 30 minutes

      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.header('X-Data-Source', 'database');
      return response;
    }
  }

  /**
   * Handler untuk PUT /albums/{id} - Mengupdate album berdasarkan ID
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response success message
   */
  async putAlbumByIdHandler(request) {
    // Validasi payload request
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    const { name, year } = request.payload;

    // Update album di database
    await this._service.editAlbumById(id, { name, year });

    // Invalidate cache untuk album
    await this._cacheService.delete(`album:${id}`);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  /**
   * Handler untuk DELETE /albums/{id} - Menghapus album berdasarkan ID
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response success message
   */
  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    // Hapus album dari database
    await this._service.deleteAlbumById(id);

    // Invalidate cache untuk album
    await this._cacheService.delete(`album:${id}`);
    await this._cacheService.delete(`album_likes:${id}`);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;