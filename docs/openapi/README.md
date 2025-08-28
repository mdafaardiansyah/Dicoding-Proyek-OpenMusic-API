# OpenMusic API V3 - OpenAPI Documentation

Dokumentasi OpenAPI (Swagger) lengkap untuk OpenMusic API V3 yang dibuat berdasarkan koleksi testing Postman.

## 📁 File Dokumentasi

- **`openmusic-api-v3.yaml`** - Dokumentasi dalam format YAML
- **`openmusic-api-v3.json`** - Dokumentasi dalam format JSON

## 🚀 Cara Menggunakan

### 1. Swagger UI Online

#### Menggunakan Swagger Editor
1. Buka [Swagger Editor](https://editor.swagger.io/)
2. Copy isi file `openmusic-api-v3.yaml` atau `openmusic-api-v3.json`
3. Paste ke editor
4. Dokumentasi akan ter-render secara otomatis

#### Menggunakan Swagger UI Demo
1. Buka [Swagger UI Demo](https://petstore.swagger.io/)
2. Masukkan URL raw file dari GitHub atau hosting lainnya
3. Klik "Explore"

### 2. Local Development

#### Menggunakan Swagger UI Docker
```bash
# Jalankan Swagger UI dengan Docker
docker run -p 8080:8080 -e SWAGGER_JSON=/docs/openmusic-api-v3.json -v $(pwd)/docs/openapi:/docs swaggerapi/swagger-ui
```

#### Menggunakan Node.js
```bash
# Install swagger-ui-express
npm install swagger-ui-express

# Tambahkan ke aplikasi Express
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi/openmusic-api-v3.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

### 3. VS Code Extension

1. Install extension "Swagger Viewer" atau "OpenAPI (Swagger) Editor"
2. Buka file `openmusic-api-v3.yaml`
3. Gunakan command palette: `Swagger: Preview`

## 📋 Fitur Dokumentasi

### ✅ Endpoint Coverage
Dokumentasi mencakup **semua endpoint** dari koleksi Postman V3:

- **Albums** (5 endpoints)
  - POST `/albums` - Tambah album
  - GET `/albums/{albumId}` - Detail album
  - PUT `/albums/{albumId}` - Edit album
  - DELETE `/albums/{albumId}` - Hapus album
  - POST `/albums/{albumId}/covers` - Upload cover

- **Album Likes** (3 endpoints)
  - POST `/albums/{albumId}/likes` - Like album
  - DELETE `/albums/{albumId}/likes` - Unlike album
  - GET `/albums/{albumId}/likes` - Jumlah likes

- **Songs** (5 endpoints)
  - POST `/songs` - Tambah lagu
  - GET `/songs` - Daftar lagu (dengan filter)
  - GET `/songs/{songId}` - Detail lagu
  - PUT `/songs/{songId}` - Edit lagu
  - DELETE `/songs/{songId}` - Hapus lagu

- **Users** (1 endpoint)
  - POST `/users` - Registrasi pengguna

- **Authentications** (3 endpoints)
  - POST `/authentications` - Login
  - PUT `/authentications` - Refresh token
  - DELETE `/authentications` - Logout

- **Playlists** (6 endpoints)
  - POST `/playlists` - Tambah playlist
  - GET `/playlists` - Daftar playlist
  - DELETE `/playlists/{playlistId}` - Hapus playlist
  - POST `/playlists/{playlistId}/songs` - Tambah lagu ke playlist
  - GET `/playlists/{playlistId}/songs` - Lagu dalam playlist
  - DELETE `/playlists/{playlistId}/songs/{songId}` - Hapus lagu dari playlist
  - GET `/playlists/{playlistId}/activities` - Aktivitas playlist

- **Collaborations** (2 endpoints)
  - POST `/collaborations` - Tambah kolaborator
  - DELETE `/collaborations` - Hapus kolaborator

- **Exports** (1 endpoint)
  - POST `/export/playlists/{playlistId}` - Export playlist ke email

### ✅ Detail Lengkap

- **Request/Response Schemas** - Model data lengkap untuk semua endpoint
- **Authentication** - JWT Bearer Token dengan contoh
- **Error Handling** - Semua kode status HTTP yang mungkin
- **Examples** - Contoh request dan response untuk setiap endpoint
- **Caching Headers** - Header `X-Data-Source` untuk endpoint yang di-cache
- **File Upload** - Spesifikasi upload cover album dengan validasi
- **Query Parameters** - Filter untuk pencarian lagu
- **Path Parameters** - Parameter ID untuk semua resource

### ✅ Fitur V3

- **Server-Side Caching** - Redis caching dengan indikator header
- **File Upload** - Upload cover album dengan validasi MIME type
- **Album Likes** - Sistem like/unlike untuk album
- **Playlist Export** - Export playlist ke email via RabbitMQ
- **Enhanced Security** - Validasi berlapis dan rate limiting

## 🔧 Konfigurasi Server

Dokumentasi sudah dikonfigurasi untuk:

- **Development**: `http://localhost:5000`
- **Production**: `https://api.openmusic.com`

Ubah URL server sesuai dengan environment Anda.

## 📊 Testing Integration

Dokumentasi ini dibuat berdasarkan:

- **200+ Test Cases** dari koleksi Postman
- **Real API Responses** dari testing aktual
- **Validation Rules** yang sudah teruji
- **Error Scenarios** yang sudah diverifikasi

## 🛠️ Maintenance

Untuk memperbarui dokumentasi:

1. **Update Postman Collection** - Tambah/ubah test cases
2. **Regenerate Documentation** - Update file YAML/JSON
3. **Validate Schema** - Pastikan format OpenAPI 3.0 valid
4. **Test Documentation** - Verifikasi dengan Swagger UI

## 📚 Resources

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Swagger Editor](https://editor.swagger.io/)
- [OpenAPI Generator](https://openapi-generator.tech/)

## 🤝 Contributing

Untuk berkontribusi pada dokumentasi:

1. Fork repository
2. Update file dokumentasi
3. Validate dengan Swagger Editor
4. Submit pull request

---

**Note**: Dokumentasi ini selalu sinkron dengan koleksi Postman V3 dan mencerminkan state terkini dari API.