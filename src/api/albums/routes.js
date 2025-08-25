/**
 * Albums Routes - Konfigurasi routing untuk Albums API
 * Mendefinisikan semua endpoint untuk operasi CRUD albums
 */

/**
 * Fungsi untuk membuat routes albums
 * @param {Object} handler - Instance dari AlbumsHandler
 * @returns {Array} - Array konfigurasi routes
 */
const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler,
    options: {
      description: 'Menambahkan album baru',
      notes: 'Endpoint untuk membuat album baru dengan nama dan tahun rilis',
      tags: ['api', 'albums'],
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler,
    options: {
      description: 'Mendapatkan album berdasarkan ID',
      notes: 'Endpoint untuk mengambil detail album berdasarkan ID',
      tags: ['api', 'albums'],
    },
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler,
    options: {
      description: 'Mengupdate album berdasarkan ID',
      notes: 'Endpoint untuk memperbarui data album berdasarkan ID',
      tags: ['api', 'albums'],
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumByIdHandler,
    options: {
      description: 'Menghapus album berdasarkan ID',
      notes: 'Endpoint untuk menghapus album berdasarkan ID',
      tags: ['api', 'albums'],
    },
  },
];

module.exports = routes;