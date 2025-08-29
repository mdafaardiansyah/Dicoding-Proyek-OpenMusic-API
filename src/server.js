/**
 * OpenMusic API Server
 * Server Hapi.js dengan konfigurasi lengkap untuk OpenMusic API
 */

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const config = require('./utils/config');
const { pool } = require('./utils');

// Import services
const { AlbumsService, SongsService } = require('./services');
const UsersService = require('./services/UsersService');
const AuthenticationsService = require('./services/AuthenticationsService');
const PlaylistsService = require('./services/PlaylistsService');
const CollaborationsService = require('./services/CollaborationsService');
const UnifiedStorageService = require('./services/storage/UnifiedStorageService');
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
  const storageService = new UnifiedStorageService();
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

  // Memuat dokumentasi OpenAPI
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../docs/openapi/openmusic-api-v3.json'), 'utf8')
  );

  // Registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // Route untuk melayani swagger.json
  server.route({
    method: 'GET',
    path: '/swagger.json',
    handler: () => swaggerDocument,
  });

  // Route untuk dokumentasi OpenAPI menggunakan Swagger UI dari CDN
  server.route({
    method: 'GET',
    path: '/docs',
    handler: (request, h) => {
      const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>OpenMusic API Documentation</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
    <link rel="icon" type="image/png" href="https://petstore.swagger.io/favicon-32x32.png" sizes="32x32" />
    <link rel="icon" type="image/png" href="https://petstore.swagger.io/favicon-16x16.png" sizes="16x16" />
    <style>
      html {
        box-sizing: border-box;
        overflow: -moz-scrollbars-vertical;
        overflow-y: scroll;
      }
      *, *:before, *:after {
        box-sizing: inherit;
      }
      body {
        margin:0;
        background: #fafafa;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
      }
      .swagger-ui .topbar {
        background-color: #2d5a27;
      }
      .swagger-ui .topbar .download-url-wrapper {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js" crossorigin></script>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-standalone-preset.js" crossorigin></script>
    <script>
    window.onload = function() {
      // Begin Swagger UI call region
      const ui = SwaggerUIBundle({
        url: '/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        validatorUrl: null,
        tryItOutEnabled: true,
        docExpansion: 'list',
        filter: true,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        onComplete: function() {
          console.log('Swagger UI loaded successfully');
        },
        onFailure: function(data) {
          console.error('Failed to load Swagger UI:', data);
        }
      });
      // End Swagger UI call region
      
      window.ui = ui;
    };
    </script>
  </body>
</html>
      `;
      return h.response(html).type('text/html');
    },
  });

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

  // Route untuk root path - redirect ke dokumentasi OpenAPI
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.redirect('/docs');
    },
  });

  // Route untuk informasi API (opsional)
  server.route({
    method: 'GET',
    path: '/info',
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
      cacheService,
    },
  });

  // Registrasi plugin users
  await server.register({
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator,
      cacheService,
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
      cacheService,
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