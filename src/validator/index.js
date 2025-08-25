/**
 * Index file untuk mengekspor semua validators
 * Memudahkan import validators dari satu tempat
 */

const AlbumsValidator = require('./albums');
const SongsValidator = require('./songs');
const UsersValidator = require('./users');
const AuthenticationsValidator = require('./authentications');
const PlaylistsValidator = require('./playlists');
const CollaborationsValidator = require('./collaborations');

module.exports = {
  AlbumsValidator,
  SongsValidator,
  UsersValidator,
  AuthenticationsValidator,
  PlaylistsValidator,
  CollaborationsValidator,
};