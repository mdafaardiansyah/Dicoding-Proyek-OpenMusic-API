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
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

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
  async getSongsHandler(request) {
    const { title, performer } = request.query;

    // Ambil data lagu dari database dengan filter pencarian
    const songs = await this._service.getSongs({ title, performer });

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  /**
   * Handler untuk GET /songs/{id} - Mendapatkan lagu berdasarkan ID
   * @param {Object} request - Hapi request object
   * @param {Object} h - Hapi response toolkit
   * @returns {Object} - Response dengan data song
   */
  async getSongByIdHandler(request) {
    const { id } = request.params;

    // Ambil data lagu dari database
    const song = await this._service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
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

    // Hapus lagu dari database
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;