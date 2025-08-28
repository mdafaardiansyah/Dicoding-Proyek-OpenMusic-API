/**
 * Songs Handler - Handler untuk menangani request API songs
 * Menggunakan auto-bind untuk binding method context
 */

const autoBind = require('auto-bind');

/**
 * Handler class untuk Songs API
 */
class SongsHandler {
  /**
   * Constructor untuk SongsHandler
   * @param {Object} service - Instance dari SongsService
   * @param {Object} validator - Instance dari SongsValidator
   * @param {Object} cacheService - Instance dari CacheService
   */
  constructor(service, validator, cacheService) {
    this._service = service;
    this._validator = validator;
    this._cacheService = cacheService;

    // Auto-bind semua method untuk mempertahankan context 'this'
    autoBind(this);
  }

  /**
   * Handler untuk POST /songs - Menambahkan lagu baru
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response dengan status 201 dan songId
   */
  async postSongHandler(request, h) {
    // Validasi payload request
    this._validator.validateSongPayload(request.payload);

    const { title, year, genre, performer, duration, albumId } = request.payload;

    // Tambahkan lagu ke database
    const songId = await this._service.addSong({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    // Invalidate cache untuk songs
    await this._cacheService.delete('songs:all:all');
    if (albumId) {
      await this._cacheService.delete(`album:${albumId}`);
    }

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * Handler untuk GET /songs - Mendapatkan semua lagu dengan fitur pencarian
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response dengan data songs
   */
  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    const cacheKey = `songs:${title || 'all'}:${performer || 'all'}`;

    try {
      const result = await this._cacheService.get(cacheKey);
      const songs = JSON.parse(result);

      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (cacheError) {
      // Ambil data lagu dari database dengan filter pencarian
      const songs = await this._service.getSongs({ title, performer });
      await this._cacheService.set(cacheKey, JSON.stringify(songs), 1800); // 30 minutes

      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      response.header('X-Data-Source', 'database');
      return response;
    }
  }

  /**
   * Handler untuk GET /songs/{id} - Mendapatkan lagu berdasarkan ID
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response dengan data song
   */
  async getSongByIdHandler(request, h) {
    const { id } = request.params;
    const cacheKey = `song:${id}`;

    try {
      const result = await this._cacheService.get(cacheKey);
      const song = JSON.parse(result);

      const response = h.response({
        status: 'success',
        data: {
          song,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (cacheError) {
      // Ambil data lagu dari database
      const song = await this._service.getSongById(id);
      await this._cacheService.set(cacheKey, JSON.stringify(song), 1800); // 30 minutes

      const response = h.response({
        status: 'success',
        data: {
          song,
        },
      });
      response.header('X-Data-Source', 'database');
      return response;
    }
  }

  /**
   * Handler untuk PUT /songs/{id} - Mengupdate lagu berdasarkan ID
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response success message
   */
  async putSongByIdHandler(request) {
    // Validasi payload request
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;
    const { title, year, genre, performer, duration, albumId } = request.payload;

    // Update lagu di database
    await this._service.editSongById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    // Invalidate cache untuk songs
    await this._cacheService.delete(`song:${id}`);
    await this._cacheService.delete('songs:all:all');
    if (albumId) {
      await this._cacheService.delete(`album:${albumId}`);
    }

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  /**
   * Handler untuk DELETE /songs/{id} - Menghapus lagu berdasarkan ID
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response success message
   */
  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    // Ambil data lagu untuk mendapatkan albumId sebelum dihapus
    const song = await this._service.getSongById(id);

    // Hapus lagu dari database
    await this._service.deleteSongById(id);

    // Invalidate cache untuk songs
    await this._cacheService.delete(`song:${id}`);
    await this._cacheService.delete('songs:all:all');
    if (song.albumId) {
      await this._cacheService.delete(`album:${song.albumId}`);
    }

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;