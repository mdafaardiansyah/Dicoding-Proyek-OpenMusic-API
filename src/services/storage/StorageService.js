// AWS S3 - Dikomentari untuk penggunaan di masa mendatang
// const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
// const config = require('../../utils/config');

class StorageService {
  constructor() {
    // S3 Configuration - Dikomentari untuk penggunaan di masa mendatang
    // this._S3 = new AWS.S3({
    //   accessKeyId: config.s3.accessKeyId,
    //   secretAccessKey: config.s3.secretAccessKey,
    //   region: config.s3.region,
    // });
  }

  writeFile(file, meta) {
    // Validasi ukuran file (maksimal 500KB)
    if (file._readableState && file._readableState.length > 512000) {
      return Promise.reject(new Error('Ukuran file melebihi batas maksimal 500KB'));
    }

    // Generate filename dengan timestamp dan extension yang sesuai
    const timestamp = +new Date();
    const fileExtension = path.extname(meta.filename);
    const filename = `${timestamp}${fileExtension}`;

    // Buat struktur direktori berdasarkan tanggal untuk organisasi yang lebih baik
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const uploadDir = path.join('uploads', 'covers', String(year), month);

    // Pastikan direktori ada
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => {
        reject(new Error(`Gagal menyimpan file: ${error.message}`));
      });

      file.pipe(fileStream);

      file.on('end', () => {
        // Return relative path untuk disimpan di database
        const relativePath = path.join('covers', String(year), month, filename).replace(/\\/g, '/');
        resolve(relativePath);
      });

      file.on('error', (error) => {
        reject(new Error(`Error saat membaca file: ${error.message}`));
      });
    });
  }

  // S3 Upload Function - Dikomentari untuk penggunaan di masa mendatang
  // writeFileS3(file, meta) {
  //   const parameter = {
  //     Bucket: config.s3.bucketName,
  //     Key: +new Date() + meta.filename,
  //     Body: file._data,
  //     ContentType: meta.headers['content-type'],
  //   };

  //   return new Promise((resolve, reject) => {
  //     this._S3.upload(parameter, (error, data) => {
  //       if (error) {
  //         return reject(error);
  //       }

  //       return resolve(data.Location);
  //     });
  //   });
  // }
}

module.exports = StorageService;