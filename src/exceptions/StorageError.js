const ClientError = require('./ClientError');

class StorageError extends ClientError {
  constructor(message, statusCode = 500) {
    super(message, statusCode);
    this.name = 'StorageError';
  }
}

module.exports = StorageError;