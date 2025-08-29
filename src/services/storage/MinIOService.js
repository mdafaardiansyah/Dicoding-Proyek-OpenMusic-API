const Minio = require('minio');
const path = require('path');
const config = require('../../utils/config');
const { MinIOError } = require('../../exceptions');

class MinIOService {
  constructor() {
    // Initialize MinIO client
    this._minioClient = new Minio.Client({
      endPoint: config.minio.endpoint.split(':')[0],
      port: parseInt(config.minio.endpoint.split(':')[1]) || 9000,
      useSSL: config.minio.useSSL,
      accessKey: config.minio.accessKey,
      secretKey: config.minio.secretKey,
    });

    this._bucketName = config.minio.bucketName;
    this._region = config.minio.region || 'us-east-1';

    console.log(`[MinIO] MinIO client initialized with endpoint: ${config.minio.endpoint}, bucket: ${this._bucketName}`);
    
    // Note: Bucket existence will be checked when first operation is performed
  }

  async _ensureBucketExists() {
    try {
      const bucketExists = await this._minioClient.bucketExists(this._bucketName);
      if (!bucketExists) {
        await this._minioClient.makeBucket(this._bucketName, this._region);
        console.log(`[MinIO] Bucket '${this._bucketName}' created successfully`);
      } else {
        console.log(`[MinIO] Bucket '${this._bucketName}' already exists`);
      }
    } catch (error) {
      console.error(`[MinIO] Error ensuring bucket exists: ${error.message}`);
      throw MinIOError.fromMinIOError(error, 'Gagal memastikan bucket tersedia');
    }
  }

  async writeFile(file, meta) {
    try {
      console.log(`[MinIO] Starting file upload: ${meta.filename}`);
      
      // Validasi ukuran file (maksimal 500KB)
      if (file._readableState && file._readableState.length > 512000) {
        throw new MinIOError('Ukuran file melebihi batas maksimal 500KB', 413);
      }

      // Generate filename dengan timestamp dan extension yang sesuai
      const timestamp = +new Date();
      const fileExtension = path.extname(meta.filename);
      const filename = `${timestamp}${fileExtension}`;

      // Buat struktur path berdasarkan tanggal untuk organisasi yang lebih baik
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const objectName = `covers/${year}/${month}/${filename}`;

      console.log(`[MinIO] Uploading to: ${objectName}`);

      // Upload file to MinIO
      const uploadInfo = await this._minioClient.putObject(
        this._bucketName,
        objectName,
        file,
        file._readableState?.length,
        {
          'Content-Type': meta.headers['content-type'] || 'application/octet-stream',
        }
      );

      console.log(`[MinIO] File uploaded successfully: ${objectName}`, uploadInfo);
      
      // Return object name untuk disimpan di database
      return objectName;
    } catch (error) {
      console.error(`[MinIO] Upload error: ${error.message}`);
      if (error instanceof MinIOError) {
        throw error;
      }
      throw MinIOError.fromMinIOError(error, 'Gagal menyimpan file ke MinIO');
    }
  }

  async getFileUrl(objectName) {
    try {
      console.log(`[MinIO] Generating presigned URL for: ${objectName}`);
      
      // Generate presigned URL for file access (expires in 24 hours)
      const presignedUrl = await this._minioClient.presignedGetObject(
        this._bucketName,
        objectName,
        24 * 60 * 60 // 24 hours in seconds
      );
      
      console.log(`[MinIO] Presigned URL generated successfully for: ${objectName}`);
      return presignedUrl;
    } catch (error) {
      console.error(`[MinIO] URL generation error: ${error.message}`);
      throw MinIOError.fromMinIOError(error, 'Gagal mendapatkan URL file');
    }
  }

  async deleteFile(objectName) {
    try {
      console.log(`[MinIO] Deleting file: ${objectName}`);
      
      await this._minioClient.removeObject(this._bucketName, objectName);
      console.log(`[MinIO] File '${objectName}' deleted successfully`);
      return true;
    } catch (error) {
      console.error(`[MinIO] Delete error: ${error.message}`);
      throw MinIOError.fromMinIOError(error, 'Gagal menghapus file');
    }
  }

  async getFileStream(objectName) {
    try {
      console.log(`[MinIO] Getting file stream for: ${objectName}`);
      
      const stream = await this._minioClient.getObject(this._bucketName, objectName);
      console.log(`[MinIO] File stream obtained successfully for: ${objectName}`);
      return stream;
    } catch (error) {
      console.error(`[MinIO] Stream error: ${error.message}`);
      throw MinIOError.fromMinIOError(error, 'Gagal mendapatkan file stream');
    }
  }

  async listFiles(prefix = 'covers/') {
    try {
      const objectsList = [];
      const objectsStream = this._minioClient.listObjects(this._bucketName, prefix, true);
      
      return new Promise((resolve, reject) => {
        objectsStream.on('data', (obj) => {
          objectsList.push(obj);
        });
        
        objectsStream.on('error', (error) => {
          reject(new Error(`Gagal mendapatkan daftar file: ${error.message}`));
        });
        
        objectsStream.on('end', () => {
          resolve(objectsList);
        });
      });
    } catch (error) {
      throw new Error(`Gagal mendapatkan daftar file: ${error.message}`);
    }
  }

  async getFileInfo(objectName) {
    try {
      const stat = await this._minioClient.statObject(this._bucketName, objectName);
      return stat;
    } catch (error) {
      throw new Error(`Gagal mendapatkan informasi file: ${error.message}`);
    }
  }
}

module.exports = MinIOService;