/**
 * OpenMusic API Server
 * Server Hapi.js dengan konfigurasi lengkap untuk OpenMusic API
 */

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const config = require('./utils/config');
const { pool } = require('./utils');

// Import services
const { AlbumsService, SongsService } = require('./services');
const UsersService = require('./services/UsersService');
const AuthenticationsService = require('./services/AuthenticationsService');
const PlaylistsService = require('./services/PlaylistsService');
const CollaborationsService = require('./services/CollaborationsService');
const StorageService = require('./services/storage/StorageService');
const CacheService = require('./services/redis/CacheService');
const ExportsService = require('./services/ExportsService');

// Import tokenize
const TokenManager = require('./tokenize/TokenManager');

// Import validators
const {
  AlbumsValidator,
  SongsValidator,
  UsersValidator,
  AuthenticationsValidator,
  PlaylistsValidator,
  CollaborationsValidator,
  ExportsValidator,
  UploadsValidator,
} = require('./validator');

// Import API plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const collaborations = require('./api/collaborations');
const exportsPlugin = require('./api/exports');

// Import exceptions
const ClientError = require('./exceptions/ClientError');

/**
 * Fungsi untuk menginisialisasi server
 */
const init = async () => {
  // Inisialisasi services
  const cacheService = new CacheService();
  const albumsService = new AlbumsService(pool, cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService(usersService);
  const playlistsService = new PlaylistsService(collaborationsService, songsService);
  const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/images'));
  const exportsService = new ExportsService();

  // Konfigurasi server Hapi.js
  const server = Hapi.server({
    port: config.app.port || 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // Konfigurasi untuk melayani file statis dari direktori uploads
  server.route({
    method: 'GET',
    path: '/uploads/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, '../uploads'),
        redirectToSlash: true,
        index: false,
      },
    },
  });

  // Mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: config.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Konfigurasi onPreResponse untuk error handling
  server.ext('onPreResponse', (request, h) => {
    // Mendapatkan response context dari request
    const { response } = request;

    // Penanganan client error secara internal
    if (response instanceof Error) {
      console.log('onPreResponse - Error caught:', {
        name: response.name,
        message: response.message,
        statusCode: response.statusCode,
        isClientError: response instanceof ClientError,
        isServer: response.isServer,
        path: request.path,
        method: request.method
      });
      
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
      message: 'OpenMusic API v3.0.0',
      description: 'API untuk mengelola data musik dengan fitur user authentication, playlist, caching, file upload, likes, dan export',
      endpoints: {
        albums: {
          'POST /albums': 'Menambahkan album baru',
          'GET /albums/{id}': 'Mendapatkan detail album berdasarkan ID',
          'PUT /albums/{id}': 'Mengubah data album berdasarkan ID',
          'DELETE /albums/{id}': 'Menghapus album berdasarkan ID',
          'POST /albums/{id}/covers': 'Upload cover album',
          'POST /albums/{id}/likes': 'Like album',
          'DELETE /albums/{id}/likes': 'Unlike album',
          'GET /albums/{id}/likes': 'Mendapatkan jumlah likes album'
        },
        songs: {
          'POST /songs': 'Menambahkan lagu baru',
          'GET /songs': 'Mendapatkan semua lagu (dengan query parameter opsional)',
          'GET /songs/{id}': 'Mendapatkan detail lagu berdasarkan ID',
          'PUT /songs/{id}': 'Mengubah data lagu berdasarkan ID',
          'DELETE /songs/{id}': 'Menghapus lagu berdasarkan ID'
        },
        users: {
          'POST /users': 'Registrasi user baru',
          'GET /users/{id}': 'Mendapatkan detail user berdasarkan ID'
        },
        authentications: {
          'POST /authentications': 'Login user',
          'PUT /authentications': 'Refresh access token',
          'DELETE /authentications': 'Logout user'
        },
        playlists: {
          'POST /playlists': 'Membuat playlist baru',
          'GET /playlists': 'Mendapatkan daftar playlist user',
          'DELETE /playlists/{id}': 'Menghapus playlist',
          'POST /playlists/{id}/songs': 'Menambahkan lagu ke playlist',
          'GET /playlists/{id}/songs': 'Mendapatkan lagu dalam playlist',
          'DELETE /playlists/{id}/songs': 'Menghapus lagu dari playlist',
          'GET /playlists/{id}/activities': 'Mendapatkan aktivitas playlist'
        },
        collaborations: {
          'POST /collaborations': 'Menambahkan kolaborator ke playlist',
          'DELETE /collaborations': 'Menghapus kolaborator dari playlist'
        },
        exports: {
          'POST /export/playlists/{id}': 'Export playlist ke email'
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
      songsService: songsService,
      storageService: storageService,
      cacheService: cacheService,
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

  // Registrasi plugin users
  await server.register({
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
    },
  });

  // Registrasi plugin authentications
  await server.register({
    plugin: authentications,
    options: {
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator,
    },
  });

  // Registrasi plugin playlists
  await server.register({
    plugin: playlists,
    options: {
      service: playlistsService,
      validator: PlaylistsValidator,
      songsService: songsService,
    },
  });

  // Registrasi plugin collaborations
  await server.register({
    plugin: collaborations,
    options: {
      collaborationsService,
      playlistsService,
      validator: CollaborationsValidator,
    },
  });

  // Registrasi plugin exports
  await server.register({
    plugin: exportsPlugin,
    options: {
      service: exportsService,
      validator: ExportsValidator,
      playlistsService: playlistsService,
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