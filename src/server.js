/**
 * OpenMusic API Server
 * Server Hapi.js dengan konfigurasi lengkap untuk OpenMusic API
 */

require('dotenv').config();

const Hapi = require('@hapi/hapi');

// Import services
const { AlbumsService, SongsService } = require('./services');

// Import validators
const { AlbumsValidator, SongsValidator } = require('./validator');

// Import API plugins
const albums = require('./api/albums');
const songs = require('./api/songs');

// Import exceptions
const ClientError = require('./exceptions/ClientError');

/**
 * Fungsi untuk menginisialisasi server
 */
const init = async () => {
  // Inisialisasi services
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  // Konfigurasi server Hapi.js
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Konfigurasi onPreResponse untuk error handling
  server.ext('onPreResponse', (request, h) => {
    // Mendapatkan response context dari request
    const { response } = request;

    // Penanganan client error secara internal
    if (response instanceof Error) {
      // Client error handling
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // Server error handling
      if (!response.isServer) {
        return h.continue;
      }

      // Penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      newResponse.code(500);
      return newResponse;
    }

    // Jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  // Route untuk root path - informasi API
  server.route({
    method: 'GET',
    path: '/',
    handler: () => ({
      status: 'success',
      message: 'OpenMusic API v1.0.0',
      description: 'API untuk mengelola data musik (album dan lagu)',
      endpoints: {
        albums: {
          'POST /albums': 'Menambahkan album baru',
          'GET /albums/{id}': 'Mendapatkan detail album berdasarkan ID',
          'PUT /albums/{id}': 'Mengubah data album berdasarkan ID',
          'DELETE /albums/{id}': 'Menghapus album berdasarkan ID'
        },
        songs: {
          'POST /songs': 'Menambahkan lagu baru',
          'GET /songs': 'Mendapatkan semua lagu (dengan query parameter opsional)',
          'GET /songs/{id}': 'Mendapatkan detail lagu berdasarkan ID',
          'PUT /songs/{id}': 'Mengubah data lagu berdasarkan ID',
          'DELETE /songs/{id}': 'Menghapus lagu berdasarkan ID'
        }
      },
      documentation: 'Akses endpoint di atas untuk menggunakan API'
    }),
    options: {
      description: 'Root endpoint - Informasi API OpenMusic',
      notes: 'Menampilkan informasi umum tentang API dan daftar endpoint yang tersedia',
      tags: ['api', 'info']
    }
  });

  // Registrasi plugin albums
  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

  // Registrasi plugin songs
  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  // Mulai server
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

// Penanganan unhandled rejection
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection:', err);
  process.exit(1);
});

// Penanganan uncaught exception
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
  process.exit(1);
});

// Inisialisasi server
init();