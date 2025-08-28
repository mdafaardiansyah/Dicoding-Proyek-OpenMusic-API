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
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: handler.postUploadImageHandler,
    options: {
      description: 'Upload cover album',
      notes: 'Endpoint untuk mengunggah sampul album',
      tags: ['api', 'albums'],
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000, // 500KB
      },
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postAlbumLikeHandler,
    options: {
      auth: 'openmusic_jwt',
      description: 'Like album',
      notes: 'Endpoint untuk menyukai album',
      tags: ['api', 'albums'],
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: handler.deleteAlbumLikeHandler,
    options: {
      auth: 'openmusic_jwt',
      description: 'Unlike album',
      notes: 'Endpoint untuk batal menyukai album',
      tags: ['api', 'albums'],
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getAlbumLikesHandler,
    options: {
      description: 'Get album likes count',
      notes: 'Endpoint untuk mendapatkan jumlah likes album',
      tags: ['api', 'albums'],
    },
  },
];

module.exports = routes;