const StorageError = require('./StorageError');

class MinIOError extends StorageError {
  constructor(message, statusCode = 500, originalError = null) {
    super(message, statusCode);
    this.name = 'MinIOError';
    this.originalError = originalError;
    
    // Map common MinIO errors to appropriate HTTP status codes
    if (originalError) {
      switch (originalError.code) {
        case 'NoSuchBucket':
          this.statusCode = 404;
          this.message = 'Bucket tidak ditemukan';
          break;
        case 'NoSuchKey':
          this.statusCode = 404;
          this.message = 'File tidak ditemukan';
          break;
        case 'AccessDenied':
          this.statusCode = 403;
          this.message = 'Akses ditolak ke MinIO storage';
          break;
        case 'InvalidAccessKeyId':
          this.statusCode = 401;
          this.message = 'Kredensial MinIO tidak valid';
          break;
        case 'SignatureDoesNotMatch':
          this.statusCode = 401;
          this.message = 'Signature MinIO tidak cocok';
          break;
        case 'EntityTooLarge':
          this.statusCode = 413;
          this.message = 'File terlalu besar untuk diupload';
          break;
        case 'InvalidBucketName':
          this.statusCode = 400;
          this.message = 'Nama bucket tidak valid';
          break;
        case 'BucketAlreadyExists':
          this.statusCode = 409;
          this.message = 'Bucket sudah ada';
          break;
        case 'ECONNREFUSED':
        case 'ENOTFOUND':
        case 'ETIMEDOUT':
          this.statusCode = 503;
          this.message = 'MinIO server tidak dapat dijangkau';
          break;
        default:
          this.statusCode = 500;
          this.message = message || 'Terjadi kesalahan pada MinIO storage';
      }
    }
  }

  static fromMinIOError(error, customMessage = null) {
    return new MinIOError(
      customMessage || error.message,
      500,
      error
    );
  }
}

module.exports = MinIOError;