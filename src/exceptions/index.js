/**
 * Index file untuk mengekspor semua custom exceptions
 */

const ClientError = require('./ClientError');
const NotFoundError = require('./NotFoundError');
const InvariantError = require('./InvariantError');
const AuthenticationError = require('./AuthenticationError');
const AuthorizationError = require('./AuthorizationError');
const StorageError = require('./StorageError');
const MinIOError = require('./MinIOError');

module.exports = {
  ClientError,
  NotFoundError,
  InvariantError,
  AuthenticationError,
  AuthorizationError,
  StorageError,
  MinIOError,
};