/**
 * Albums Handler - Handler untuk menangani request API albums
 * Menggunakan auto-bind untuk binding method context
 */

const autoBind = require('auto-bind');

/**
 * Handler class untuk Albums API
 */
class AlbumsHandler {
  /**
   * Constructor untuk AlbumsHandler
   * @param {Object} service - Instance dari AlbumsService
   * @param {Object} validator - Instance dari AlbumsValidator
   */
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

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
  async getAlbumByIdHandler(request) {
    const { id } = request.params;

    // Ambil data album dari database
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: {
        album,
      },
    };
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

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;