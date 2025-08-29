const StorageService = require('./StorageService');
const MinIOService = require('./MinIOService');
const config = require('../../utils/config');
const { StorageError } = require('../../exceptions');

class UnifiedStorageService {
  constructor() {
    this._storageType = config.storage.type || 'local';
    
    console.log(`[Storage] Initializing storage service with type: ${this._storageType}`);
    
    // Initialize appropriate storage service based on configuration
    switch (this._storageType) {
      case 'minio':
        this._storageService = new MinIOService();
        break;
      case 's3':
        // TODO: Implement S3Service when needed
        throw new StorageError('S3 storage not implemented yet', 501);
      case 'local':
      default:
        this._storageService = new StorageService();
        break;
    }
    
    console.log(`[Storage] Storage service initialized successfully`);
  }

  async writeFile(file, meta) {
    try {
      console.log(`[Storage] Writing file using ${this._storageType} storage: ${meta.filename}`);
      const result = await this._storageService.writeFile(file, meta);
      console.log(`[Storage] File written successfully: ${result}`);
      return result;
    } catch (error) {
      console.error(`[Storage] Write error with ${this._storageType}: ${error.message}`);
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Storage write error: ${error.message}`);
    }
  }

  async getFileUrl(filePath) {
    try {
      console.log(`[Storage] Getting file URL using ${this._storageType} storage: ${filePath}`);
      
      // For MinIO, generate presigned URL
      if (this._storageType === 'minio' && this._storageService.getFileUrl) {
        const url = await this._storageService.getFileUrl(filePath);
        console.log(`[Storage] Presigned URL generated successfully`);
        return url;
      }
      
      // For local storage, return relative path
      if (this._storageType === 'local') {
        const url = `/uploads/${filePath}`;
        console.log(`[Storage] Local file URL generated: ${url}`);
        return url;
      }
      
      // For S3, return the full URL (to be implemented)
      if (this._storageType === 's3') {
        // TODO: Implement S3 URL generation
        throw new StorageError('S3 URL generation not implemented yet', 501);
      }
      
      return filePath;
    } catch (error) {
      console.error(`[Storage] URL generation error with ${this._storageType}: ${error.message}`);
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Storage URL generation error: ${error.message}`);
    }
  }

  async deleteFile(filePath) {
    try {
      console.log(`[Storage] Deleting file using ${this._storageType} storage: ${filePath}`);
      
      // For MinIO and S3, use their delete methods
      if ((this._storageType === 'minio' || this._storageType === 's3') && this._storageService.deleteFile) {
        const result = await this._storageService.deleteFile(filePath);
        console.log(`[Storage] File deleted successfully: ${filePath}`);
        return result;
      }
      
      // For local storage, implement file deletion
      if (this._storageType === 'local') {
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join('uploads', filePath);
        
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          console.log(`[Storage] Local file '${fullPath}' deleted successfully`);
          return true;
        }
        
        console.log(`[Storage] Local file '${fullPath}' not found`);
        return false;
      }
      
      return false;
    } catch (error) {
      console.error(`[Storage] Delete error with ${this._storageType}: ${error.message}`);
      if (error instanceof StorageError) {
        throw error;
      }
      throw new StorageError(`Storage delete error: ${error.message}`);
    }
  }

  async getFileStream(filePath) {
    try {
      // For MinIO and S3, use their stream methods
      if ((this._storageType === 'minio' || this._storageType === 's3') && this._storageService.getFileStream) {
        return await this._storageService.getFileStream(filePath);
      }
      
      // For local storage, create file stream
      if (this._storageType === 'local') {
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join('uploads', filePath);
        
        if (fs.existsSync(fullPath)) {
          return fs.createReadStream(fullPath);
        }
        
        throw new Error(`Local file '${fullPath}' not found`);
      }
      
      throw new Error('File stream not supported for this storage type');
    } catch (error) {
      throw new Error(`Storage stream error: ${error.message}`);
    }
  }

  async listFiles(prefix) {
    try {
      // For MinIO and S3, use their list methods
      if ((this._storageType === 'minio' || this._storageType === 's3') && this._storageService.listFiles) {
        return await this._storageService.listFiles(prefix);
      }
      
      // For local storage, implement directory listing
      if (this._storageType === 'local') {
        const fs = require('fs');
        const path = require('path');
        const uploadDir = path.join('uploads', prefix || 'covers');
        
        if (fs.existsSync(uploadDir)) {
          const files = fs.readdirSync(uploadDir, { recursive: true });
          return files.map(file => ({
            name: file,
            size: fs.statSync(path.join(uploadDir, file)).size,
            lastModified: fs.statSync(path.join(uploadDir, file)).mtime,
          }));
        }
        
        return [];
      }
      
      return [];
    } catch (error) {
      throw new Error(`Storage list error: ${error.message}`);
    }
  }

  getStorageType() {
    return this._storageType;
  }

  async getFileInfo(filePath) {
    try {
      // For MinIO and S3, use their info methods
      if ((this._storageType === 'minio' || this._storageType === 's3') && this._storageService.getFileInfo) {
        return await this._storageService.getFileInfo(filePath);
      }
      
      // For local storage, get file stats
      if (this._storageType === 'local') {
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join('uploads', filePath);
        
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath);
          return {
            size: stats.size,
            lastModified: stats.mtime,
            etag: null, // Not available for local files
          };
        }
        
        throw new Error(`Local file '${fullPath}' not found`);
      }
      
      throw new Error('File info not supported for this storage type');
    } catch (error) {
      throw new Error(`Storage info error: ${error.message}`);
    }
  }
}

module.exports = UnifiedStorageService;