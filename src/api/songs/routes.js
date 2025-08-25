/**
 * Songs Routes - Konfigurasi routing untuk Songs API
 * Mendefinisikan semua endpoint untuk operasi CRUD songs dengan fitur pencarian
 */

/**
 * Fungsi untuk membuat routes songs
 * @param {Object} handler - Instance dari SongsHandler
 * @returns {Array} - Array konfigurasi routes
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
    options: {
      description: 'Menambahkan lagu baru',
      notes: 'Endpoint untuk membuat lagu baru dengan title, year, genre, performer, duration, dan albumId (opsional)',
      tags: ['api', 'songs'],
    },
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
    options: {
      description: 'Mendapatkan semua lagu dengan fitur pencarian',
      notes: 'Endpoint untuk mengambil semua lagu dengan query parameter title dan performer untuk pencarian',
      tags: ['api', 'songs'],
    },
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongByIdHandler,
    options: {
      description: 'Mendapatkan lagu berdasarkan ID',
      notes: 'Endpoint untuk mengambil detail lagu berdasarkan ID',
      tags: ['api', 'songs'],
    },
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongByIdHandler,
    options: {
      description: 'Mengupdate lagu berdasarkan ID',
      notes: 'Endpoint untuk memperbarui data lagu berdasarkan ID',
      tags: ['api', 'songs'],
    },
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongByIdHandler,
    options: {
      description: 'Menghapus lagu berdasarkan ID',
      notes: 'Endpoint untuk menghapus lagu berdasarkan ID',
      tags: ['api', 'songs'],
    },
  },
];

module.exports = routes;