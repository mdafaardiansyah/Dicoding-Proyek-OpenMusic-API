# OpenMusic API (V3)

OpenMusic API adalah RESTful API untuk mengelola data musik yang dibangun menggunakan Node.js dan Hapi.js framework. API ini menyediakan fitur lengkap untuk mengelola album, lagu, user authentication, playlist, kolaborasi, caching, exports, dan uploads dengan operasi CRUD lengkap. API ini merupakan Submission ke-3 dari Kelas Belajar Fundamental Back-End dengan JavaScript di Dicoding.

## 🚀 Apa yang Baru di V3?

Versi 3 dari OpenMusic API menghadirkan peningkatan performa dan fitur-fitur enterprise dengan teknologi modern:

### ✨ Fitur Baru V3
- **Server-Side Caching**: Redis caching untuk optimasi performa API
- **Album Cover Upload**: Upload dan manajemen cover album dengan validasi
- **Album Likes System**: Fitur like/unlike album dengan tracking
- **Playlist Export**: Export playlist ke format JSON via message queue
- **File Storage**: Multi-storage support (Local, AWS S3, MinIO) dengan validasi ukuran dan tipe
- **Message Queue**: RabbitMQ integration untuk background processing
- **Code Quality**: ESLint integration untuk standarisasi kode
- **Enhanced Configuration**: Centralized config management

### 🔄 Perubahan dari V2
- **Performance**: Redis caching mengurangi database load hingga 80%
- **Storage**: Multi-storage file upload system (Local/S3/MinIO) dengan validasi keamanan
- **Scalability**: Message queue untuk operasi asynchronous
- **Code Quality**: ESLint rules untuk konsistensi kode
- **Database Schema**: 1 tabel baru (user_album_likes) dan kolom cover di albums
- **New Dependencies**: Redis, RabbitMQ, Multer untuk file handling
- **Enhanced Error Handling**: Improved error responses dengan proper status codes

## 📊 Perbandingan Versi

| Fitur | V1 | V2 | V3 |
|-------|----|----|----|
| Albums & Songs CRUD | ✅ | ✅ | ✅ |
| User Authentication | ❌ | ✅ | ✅ |
| Playlist Management | ❌ | ✅ | ✅ |
| Collaboration System | ❌ | ✅ | ✅ |
| Server-Side Caching | ❌ | ❌ | ✅ |
| File Upload | ❌ | ❌ | ✅ |
| Album Likes | ❌ | ❌ | ✅ |
| Playlist Export | ❌ | ❌ | ✅ |
| Message Queue | ❌ | ❌ | ✅ |
| Code Linting | ❌ | ❌ | ✅ |
| Performance Optimization | ❌ | ❌ | ✅ |

## Fitur

### 🎵 Core Features (V1)
- **Albums Management**: CRUD operations untuk album
- **Songs Management**: CRUD operations untuk lagu dengan fitur pencarian
- **Database Integration**: PostgreSQL dengan connection pooling
- **Input Validation**: Joi schema validation
- **Error Handling**: Custom exceptions dan proper HTTP status codes
- **Auto-binding**: Automatic method binding untuk handler classes

### 🔐 Authentication & Authorization (V2)
- **User Registration**: Registrasi pengguna baru dengan validasi
- **User Authentication**: Login/logout dengan JWT tokens
- **Token Management**: Access token dan refresh token system
- **Password Security**: Bcrypt hashing untuk keamanan password
- **Protected Routes**: Middleware authentication untuk endpoint sensitif

### 📝 Playlist Management (V2)
- **Personal Playlists**: Membuat dan mengelola playlist pribadi
- **Playlist Songs**: Menambah/menghapus lagu dari playlist
- **Playlist Sharing**: Sistem kolaborasi untuk berbagi playlist
- **Activity Tracking**: Log aktivitas untuk setiap perubahan playlist
- **Access Control**: Owner dan collaborator permissions

### ⚡ Performance & Caching (V3)
- **Redis Caching**: Server-side caching untuk semua endpoint GET
- **Cache Invalidation**: Smart cache invalidation pada data changes
- **Cache Headers**: Proper cache headers untuk client-side caching
- **Performance Monitoring**: Cache hit/miss tracking
- **Configurable TTL**: Customizable cache expiration times

### 📁 File Management (V3)
- **Album Cover Upload**: Upload cover image untuk album
- **File Validation**: Validasi tipe file (JPEG, PNG) dan ukuran maksimal
- **Multi-Storage Support**: Local storage, AWS S3, dan MinIO object storage
- **Storage Configuration**: Configurable storage backend via environment variables
- **Image Processing**: Automatic file naming dan path management
- **Storage Security**: Validasi keamanan file upload dengan multiple storage backends

### ❤️ Social Features (V3)
- **Album Likes**: Sistem like/unlike untuk album
- **Like Tracking**: Tracking jumlah likes per album
- **User Preferences**: Menyimpan preferensi user terhadap album
- **Like Status**: Check status like user untuk album tertentu

### 📤 Export System (V3)
- **Playlist Export**: Export playlist ke format JSON
- **Background Processing**: Asynchronous export menggunakan message queue
- **RabbitMQ Integration**: Message queue untuk scalable processing
- **Export Status**: Tracking status export job
- **Email Notification**: Notifikasi email setelah export selesai

### 🔧 Code Quality (V3)
- **ESLint Integration**: Automated code linting dan formatting
- **Code Standards**: Consistent coding style across project
- **Error Prevention**: Static analysis untuk mencegah bugs
- **Development Workflow**: Pre-commit hooks untuk quality assurance

## Tech Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Hapi.js
- **Database**: PostgreSQL
- **Authentication**: @hapi/jwt
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Migration**: node-pg-migrate
- **Environment**: dotenv
- **Token Management**: JWT (JSON Web Tokens)

### V3 New Technologies
- **Caching**: Redis for server-side caching
- **Message Queue**: RabbitMQ (amqplib) for background processing
- **File Upload**: @hapi/inert, multer for file handling
- **Code Quality**: ESLint for code linting and formatting
- **Configuration**: Centralized config management
- **Storage**: Multi-storage support (Local, AWS S3, MinIO) with organized structure
- **Cloud Storage**: AWS SDK for S3 and MinIO object storage integration
- **Performance**: Cache optimization and monitoring

## Related Services

### Consumer Services
Berikut adalah layanan-layanan yang mengonsumsi OpenMusic API:

- **[OpenMusic Consumer](https://github.com/mdafaardiansyah/openmusic_consumer)** - Layanan consumer independen untuk memproses export playlist melalui RabbitMQ message queue dan mengirimkan hasil export via email. Service ini menangani background processing untuk operasi export yang memakan waktu dan resources.

## API Endpoints

### 🎵 Albums (Public + V3 Features)

- `POST /albums` - Menambahkan album baru
- `GET /albums/{id}` - Mendapatkan album berdasarkan ID (dengan daftar lagu) ⚡ *Cached*
- `PUT /albums/{id}` - Mengupdate album berdasarkan ID
- `DELETE /albums/{id}` - Menghapus album berdasarkan ID
- `POST /albums/{id}/covers` - Upload cover album 🆕 *V3*
- `POST /albums/{id}/likes` - Like album 🆕 *V3* 🔒
- `DELETE /albums/{id}/likes` - Unlike album 🆕 *V3* 🔒
- `GET /albums/{id}/likes` - Get album likes count 🆕 *V3*

### 🎶 Songs (Public + V3 Caching)

- `POST /songs` - Menambahkan lagu baru
- `GET /songs` - Mendapatkan semua lagu (dengan fitur pencarian) ⚡ *Cached*
- `GET /songs/{id}` - Mendapatkan lagu berdasarkan ID ⚡ *Cached*
- `PUT /songs/{id}` - Mengupdate lagu berdasarkan ID
- `DELETE /songs/{id}` - Menghapus lagu berdasarkan ID

#### Query Parameters untuk GET /songs

- `title` - Pencarian berdasarkan judul lagu
- `performer` - Pencarian berdasarkan nama performer

### 👤 Users (V2)

- `POST /users` - Registrasi pengguna baru
- `GET /users/{id}` - Mendapatkan detail pengguna berdasarkan ID

### 🔐 Authentications (V2)

- `POST /authentications` - Login pengguna
- `PUT /authentications` - Refresh access token
- `DELETE /authentications` - Logout pengguna

### 📝 Playlists (V2 - Protected + V3 Caching)

- `POST /playlists` - Membuat playlist baru 🔒
- `GET /playlists` - Mendapatkan daftar playlist pengguna 🔒 ⚡ *Cached*
- `DELETE /playlists/{id}` - Menghapus playlist 🔒
- `POST /playlists/{id}/songs` - Menambahkan lagu ke playlist 🔒
- `GET /playlists/{id}/songs` - Mendapatkan lagu dalam playlist 🔒 ⚡ *Cached*
- `DELETE /playlists/{id}/songs` - Menghapus lagu dari playlist 🔒
- `GET /playlists/{id}/activities` - Mendapatkan aktivitas playlist 🔒 ⚡ *Cached*

### 🤝 Collaborations (V2 - Protected)

- `POST /collaborations` - Menambahkan kolaborator ke playlist 🔒
- `DELETE /collaborations` - Menghapus kolaborator dari playlist 🔒

### 📤 Exports (V3 - Protected)

- `POST /export/playlists/{playlistId}` - Export playlist ke email 🔒 🆕 *V3*

> 🔒 = Memerlukan authentication header

## Installation

### Prerequisites
- Node.js (v14 atau lebih tinggi)
- PostgreSQL
- Redis (V3) 🆕
- RabbitMQ (V3) 🆕
- npm atau yarn

### Setup Steps

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd openmusic-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   # Buat database PostgreSQL
   createdb openmusic
   
   # Jalankan migrasi
   npm run migrate up
   ```

4. **Setup Redis (V3)** 🆕
   ```bash
   # Install Redis (Ubuntu/Debian)
   sudo apt update
   sudo apt install redis-server
   
   # Start Redis service
   sudo systemctl start redis-server
   sudo systemctl enable redis-server
   
   # Verify Redis is running
   redis-cli ping
   ```

5. **Setup RabbitMQ (V3)** 🆕
   ```bash
   # Install RabbitMQ (Ubuntu/Debian)
   sudo apt update
   sudo apt install rabbitmq-server
   
   # Start RabbitMQ service
   sudo systemctl start rabbitmq-server
   sudo systemctl enable rabbitmq-server
   
   # Enable management plugin (optional)
   sudo rabbitmq-plugins enable rabbitmq_management
   ```

6. **Setup MinIO (V3 - Optional)** 🆕
   ```bash
   # Using Docker (Recommended)
   docker run -d \
     --name minio \
     -p 9000:9000 \
     -p 9001:9001 \
     -e MINIO_ROOT_USER=minioadmin \
     -e MINIO_ROOT_PASSWORD=minioadmin \
     -v minio_data:/data \
     minio/minio server /data --console-address ":9001"
   
   # Create bucket (after MinIO is running)
   # Access MinIO Console at http://localhost:9001
   # Login with minioadmin/minioadmin
   # Create bucket named 'openmusic'
   ```

7. **Configure environment**
   - Copy `.env.example` ke `.env`
   - Sesuaikan konfigurasi database, JWT secrets, Redis, RabbitMQ, dan email
   - **Storage Configuration**: Set `STORAGE_TYPE` to `local`, `s3`, or `minio`
   - **For MinIO**: Configure `MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET_NAME`
   - **For AWS S3**: Configure `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`, `AWS_REGION`

8. **Create uploads directory (V3 - Local Storage Only)** 🆕
   ```bash
   mkdir uploads
   ```

9. **Start server**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm start
   ```

   Server akan berjalan di `http://localhost:5000`

### V3 Service Verification

**Check Redis connection:**
```bash
redis-cli ping
# Should return: PONG
```

**Check RabbitMQ:**
```bash
sudo rabbitmqctl status
# Should show RabbitMQ status
```

**Access RabbitMQ Management (if enabled):**
- URL: `http://localhost:15672`
- Default credentials: `guest/guest`

## Environment Variables

```env
# Server Configuration
HOST=localhost
PORT=5000

# Database Configuration
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=openmusicapi
PGHOST=localhost
PGPORT=5432

# JWT Configuration (V2)
ACCESS_TOKEN_KEY=your_access_token_secret_key
REFRESH_TOKEN_KEY=your_refresh_token_secret_key
ACCESS_TOKEN_AGE=1800

# V3 New Configuration
# Redis Configuration (V3)
REDIS_SERVER=localhost:6379

# RabbitMQ Configuration (V3)
RABBITMQ_SERVER=amqp://localhost

# Mail Configuration (V3)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# Storage Configuration (V3)
# Supported types: 'local', 's3', 'minio'
STORAGE_TYPE=local

# AWS S3 Configuration (V3)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket
AWS_REGION=us-east-1

# MinIO Configuration (V3)
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=openmusic
MINIO_REGION=us-east-1
MINIO_USE_SSL=false

# Node Environment
NODE_ENV=development
```

## Storage Configuration (V3)

OpenMusic API V3 mendukung tiga jenis storage backend untuk menyimpan file cover album:

### 🏠 Local Storage (Default)
```env
STORAGE_TYPE=local
```
- File disimpan di direktori `uploads/covers/` lokal
- Tidak memerlukan konfigurasi tambahan
- Cocok untuk development dan testing
- Perlu membuat direktori `uploads` secara manual

### ☁️ AWS S3 Storage
```env
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket
AWS_REGION=us-east-1
```
- File disimpan di AWS S3 bucket
- Memerlukan AWS credentials yang valid
- Bucket harus sudah dibuat sebelumnya
- Cocok untuk production dengan high availability

### 🗄️ MinIO Storage
```env
STORAGE_TYPE=minio
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=openmusic
MINIO_REGION=us-east-1
MINIO_USE_SSL=false
```
- File disimpan di MinIO object storage
- Compatible dengan S3 API
- Dapat dijalankan secara self-hosted
- Cocok untuk production dengan kontrol penuh
- Bucket akan dibuat otomatis jika belum ada

### 🔄 Switching Storage Backend
Untuk mengganti storage backend:
1. Update `STORAGE_TYPE` di file `.env`
2. Konfigurasi environment variables sesuai storage yang dipilih
3. Restart server
4. File yang sudah ada tidak akan dipindahkan otomatis

## Database Schema

### 🎵 Core Tables (V1)

#### Albums Table
```sql
CREATE TABLE albums (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  cover_url TEXT, -- V3: Added for album cover images
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Songs Table
```sql
CREATE TABLE songs (
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  genre TEXT NOT NULL,
  performer TEXT NOT NULL,
  duration INTEGER,
  album_id VARCHAR(50) REFERENCES albums(id) ON DELETE SET NULL ON UPDATE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 🔐 Authentication Tables (V2)

#### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fullname TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Authentications Table
```sql
CREATE TABLE authentications (
  token TEXT PRIMARY KEY
);
```

### 📝 Playlist Tables (V2)

#### Playlists Table
```sql
CREATE TABLE playlists (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  owner VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Playlist Songs Table
```sql
CREATE TABLE playlist_songs (
  id VARCHAR(50) PRIMARY KEY,
  playlist_id VARCHAR(50) NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id VARCHAR(50) NOT NULL REFERENCES songs(id) ON DELETE CASCADE
);
```

#### Collaborations Table
```sql
CREATE TABLE collaborations (
  id VARCHAR(50) PRIMARY KEY,
  playlist_id VARCHAR(50) NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

#### Playlist Song Activities Table
```sql
CREATE TABLE playlist_song_activities (
  id VARCHAR(50) PRIMARY KEY,
  playlist_id VARCHAR(50) NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id VARCHAR(50) NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ❤️ Social Features Tables (V3)

#### User Album Likes Table
```sql
CREATE TABLE user_album_likes (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  album_id VARCHAR(50) NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, album_id)
);
```

## Project Structure

```
openmusic-api/
├── migrations/              # Database migrations
├── src/
│   ├── api/                # API route handlers
│   │   ├── albums/         # Album endpoints (+ V3 covers, likes)
│   │   │   ├── handler.js
│   │   │   ├── index.js
│   │   │   └── routes.js
│   │   ├── songs/          # Song endpoints (+ V3 caching)
│   │   │   ├── handler.js
│   │   │   ├── index.js
│   │   │   └── routes.js
│   │   ├── users/          # User endpoints (V2 + V3 caching)
│   │   │   ├── handler.js
│   │   │   ├── index.js
│   │   │   └── routes.js
│   │   ├── authentications/ # Auth endpoints (V2)
│   │   │   ├── handler.js
│   │   │   ├── index.js
│   │   │   └── routes.js
│   │   ├── playlists/      # Playlist endpoints (V2 + V3 caching)
│   │   │   ├── handler.js
│   │   │   ├── index.js
│   │   │   └── routes.js
│   │   ├── collaborations/ # Collaboration endpoints (V2)
│   │   │   ├── handler.js
│   │   │   ├── index.js
│   │   │   └── routes.js
│   │   └── exports/        # Export endpoints (V3) 🆕
│   │       ├── handler.js
│   │       ├── index.js
│   │       └── routes.js
│   ├── exceptions/         # Custom error classes
│   │   ├── AuthenticationError.js  # V2 - New exception
│   │   ├── AuthorizationError.js   # V2 - New exception
│   │   ├── ClientError.js
│   │   ├── InvariantError.js
│   │   ├── NotFoundError.js
│   │   └── index.js
│   ├── services/          # Business logic services
│   │   ├── postgres/      # Database services
│   │   │   ├── AlbumsService.js        # V1 - Enhanced with songs + V3 likes
│   │   │   ├── SongsService.js         # V1
│   │   │   ├── UsersService.js         # V2 - User management
│   │   │   ├── AuthenticationsService.js # V2 - Token management
│   │   │   ├── PlaylistsService.js     # V2 - Playlist operations
│   │   │   └── CollaborationsService.js # V2 - Collaboration logic
│   │   ├── redis/         # Redis caching service (V3) 🆕
│   │   │   └── CacheService.js
│   │   ├── storage/       # File storage service (V3) 🆕
│   │   │   └── StorageService.js
│   │   ├── rabbitmq/      # Message queue service (V3) 🆕
│   │   │   ├── ProducerService.js
│   │   │   └── ConsumerService.js
│   │   └── mail/          # Email service (V3) 🆕
│   │       └── MailSender.js
│   ├── tokenize/          # JWT token management (V2)
│   │   └── TokenManager.js
│   ├── utils/             # Utility functions (+ V3 config)
│   │   ├── database.js
│   │   ├── config.js      # V3 - Centralized config 🆕
│   │   └── index.js
│   ├── validator/         # Joi validation schemas (+ V3 uploads)
│   │   ├── albums/
│   │   ├── songs/
│   │   ├── users/         # V2 - User validation
│   │   ├── authentications/ # V2 - Auth validation
│   │   ├── playlists/     # V2 - Playlist validation
│   │   ├── collaborations/ # V2 - Collaboration validation
│   │   ├── exports/       # V3 - Export validation 🆕
│   │   ├── uploads/       # V3 - Upload validation 🆕
│   │   └── index.js
│   └── server.js          # Main server configuration (+ V3 services)
├── uploads/               # Uploaded files directory (V3) 🆕
├── .env                   # Environment variables (+ V3 config)
├── .eslintrc.js          # ESLint configuration (V3) 🆕
├── .gitignore
├── package.json          # Dependencies (+ V3 packages)
└── README.md
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Album berhasil ditambahkan",
  "data": {
    "albumId": "album-Qbax5Oy7L8WKf74l"
  }
}
```

### Error Response
```json
{
  "status": "fail",
  "message": "Album tidak ditemukan"
}
```

### Authentication Response (V2)
```json
{
  "status": "success",
  "message": "Authentication berhasil ditambahkan",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Enhanced Album Response (V2)
```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Qbax5Oy7L8WKf74l",
      "name": "Viva la Vida",
      "year": 2008,
      "songs": [
        {
          "id": "song-Qbax5Oy7L8WKf74l",
          "title": "Life in Technicolor",
          "performer": "Coldplay"
        }
      ]
    }
  }
}
```

## Development

### Running Tests
```bash
# Test V2 features
node test-v2-features.js

# Run linting
npm run lint
```

### Database Migration Commands
```bash
# Create new migration
npm run migrate create <migration-name>

# Run migrations
npm run migrate up

# Rollback migrations
npm run migrate down

# Reset database (V2)
node database/reset-database.js
```

### Authentication Usage (V2)

#### 1. Register User
```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "secret123",
    "fullname": "John Doe"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "secret123"
  }'
```

#### 3. Access Protected Endpoint
```bash
curl -X GET http://localhost:5000/playlists \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Migration Guide

### V1 → V2 Migration

#### Breaking Changes
- **Album Response**: GET /albums/{id} sekarang menyertakan array songs
- **New Dependencies**: Perlu install @hapi/jwt dan bcrypt
- **Environment Variables**: Tambahkan JWT configuration
- **Database**: 5 tabel baru perlu di-migrate

#### Migration Steps
1. Install dependencies baru: `npm install @hapi/jwt bcrypt`
2. Update environment variables dengan JWT keys
3. Run database migrations: `npm run migrate up`
4. Update client code untuk handle new album response format
5. Implement authentication flow untuk protected endpoints

### V2 → V3 Migration 🆕

#### Prerequisites Installation
1. **Install Redis**:
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install redis-server
   
   # macOS
   brew install redis
   
   # Windows
   # Download from: https://redis.io/download
   ```

2. **Install RabbitMQ**:
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install rabbitmq-server
   
   # macOS
   brew install rabbitmq
   
   # Windows
   # Download from: https://www.rabbitmq.com/download.html
   ```

#### Database Migration
1. **Jalankan migrasi V3**:
   ```bash
   npm run migrate up
   ```
   
   Migrasi ini akan menambahkan:
   - Tabel `user_album_likes`
   - Kolom `cover_url` pada tabel `albums`

#### Environment Configuration
1. **Update `.env` file** dengan konfigurasi baru:
   ```env
   # Redis Configuration
   REDIS_SERVER=localhost:6379
   
   # RabbitMQ Configuration
   RABBITMQ_SERVER=amqp://localhost
   
   # Mail Configuration
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=465
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_app_password
   ```

#### Dependencies Update
1. **Install new dependencies**:
   ```bash
   npm install
   ```
   
   New packages include:
   - `redis` - Redis client
   - `amqplib` - RabbitMQ client
   - `nodemailer` - Email service
   - `@hapi/inert` - File serving
   - `eslint` - Code linting

#### File System Setup
1. **Create uploads directory**:
   ```bash
   mkdir uploads
   chmod 755 uploads
   ```

#### Service Verification
1. **Test Redis connection**:
   ```bash
   redis-cli ping
   # Expected: PONG
   ```

2. **Test RabbitMQ**:
   ```bash
   sudo rabbitmqctl status
   ```

3. **Start application**:
   ```bash
   npm start
   ```
   
   Check logs for successful connections:
   - ✅ Redis client connected
   - ✅ RabbitMQ connected
   - ✅ Server running on port 5000

#### New Features Available
Setelah migrasi berhasil, fitur baru yang tersedia:
- ⚡ **Caching**: Semua GET endpoints otomatis ter-cache
- 📁 **File Upload**: Upload cover album via `POST /albums/{id}/covers`
- ❤️ **Album Likes**: Like/unlike album via `POST/DELETE /albums/{id}/likes`
- 📤 **Playlist Export**: Export playlist via `POST /export/playlists/{id}`
- 🔧 **Code Quality**: ESLint integration untuk development

#### Breaking Changes
- **Tidak ada breaking changes** untuk existing V2 endpoints
- Semua V2 functionality tetap bekerja dengan performa yang lebih baik
- Response format tetap konsisten
- Authentication mechanism tidak berubah

## Performance & Caching (V3) 🆕

### Redis Caching Strategy
- **Cache-First Approach**: Semua GET endpoints mengecek cache terlebih dahulu
- **Smart Invalidation**: Cache otomatis di-invalidate saat data berubah
- **Configurable TTL**: Setiap endpoint memiliki cache expiration yang dapat dikonfigurasi
- **Cache Keys**: Structured cache keys untuk easy management
- **Memory Optimization**: Efficient memory usage dengan proper cache eviction

### Cached Endpoints
| Endpoint | Cache Duration | Cache Key Pattern |
|----------|----------------|-------------------|
| `GET /albums/{id}` | 30 minutes | `albums:{id}` |
| `GET /songs` | 15 minutes | `songs:all:{query}` |
| `GET /songs/{id}` | 30 minutes | `songs:{id}` |
| `GET /playlists` | 10 minutes | `playlists:user:{userId}` |
| `GET /playlists/{id}/songs` | 15 minutes | `playlists:{id}:songs` |
| `GET /playlists/{id}/activities` | 5 minutes | `playlists:{id}:activities` |

### Cache Headers
- **ETag**: Entity tags untuk client-side caching
- **Cache-Control**: Proper cache directives
- **Last-Modified**: Timestamp-based cache validation
- **Vary**: Header variation handling

### Performance Improvements
- **Response Time**: 60-80% faster untuk cached responses
- **Database Load**: Significant reduction dalam database queries
- **Scalability**: Better handling untuk concurrent requests
- **Memory Usage**: Optimized memory consumption

## Security Features (V2)

- **Password Hashing**: Menggunakan bcrypt dengan salt rounds
- **JWT Tokens**: Access token (30 menit) dan refresh token
- **Route Protection**: Middleware authentication untuk endpoint sensitif
- **Input Validation**: Enhanced validation dengan Joi schemas
- **SQL Injection Prevention**: Parameterized queries dengan pg
- **CORS Handling**: Proper CORS configuration

### V3 Security Enhancements 🆕
- **File Upload Security**: Validasi tipe file dan ukuran maksimal
- **Path Traversal Prevention**: Secure file path handling
- **Cache Security**: Secure cache key generation
- **Rate Limiting**: Built-in protection against abuse (via caching)
- **Input Sanitization**: Enhanced validation untuk file uploads

## Development & Testing (V3) 🆕

### Code Quality
```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Check code formatting
npm run format:check
```

### Development Workflow
1. **Setup development environment**:
   ```bash
   npm install
   npm run migrate up
   ```

2. **Start services** (Redis & RabbitMQ harus running)

3. **Run in development mode**:
   ```bash
   npm run start:dev
   ```

4. **Code quality checks**:
   ```bash
   npm run lint
   npm run format:check
   ```

### Testing dengan Postman 🆕

#### File Structure Postman
```
docs/postman/v3/
├── Open Music API V3 Test.postman_collection.json    # Main test collection
├── OpenMusic API Test.postman_environment.json      # Environment variables
└── test-files/                                       # Files untuk testing upload
    ├── picture-large.jpg                            # Test file besar (>500KB)
    ├── picture-small.jpg                            # Test file kecil (<500KB)
    └── text-small.txt                               # Test invalid file type
```

#### Import Collection & Environment
1. **Buka Postman**

2. **Import Collection**:
   - Klik "Import" di Postman
   - Pilih file: `docs/postman/v3/Open Music API V3 Test.postman_collection.json`
   - Klik "Import"

3. **Import Environment**:
   - Klik "Import" di Postman
   - Pilih file: `docs/postman/v3/OpenMusic API Test.postman_environment.json`
   - Klik "Import"
   - Pilih environment "OpenMusic API Test" di dropdown

#### Collection Overview
Collection ini berisi **200+ automated tests** yang mencakup:

**📁 Authentication**
- User Registration
- User Login
- Token Refresh
- Access Token Validation

**📁 Albums**
- Create Album
- Get All Albums
- Get Album by ID (with caching test)
- Update Album
- Delete Album
- Upload Album Cover
- Album Likes (Like/Unlike)

**📁 Songs**
- Create Song
- Get All Songs (with caching test)
- Get Song by ID (with caching test)
- Update Song
- Delete Song

**📁 Playlists**
- Create Playlist
- Get User Playlists (with caching test)
- Add Song to Playlist
- Get Playlist Songs (with caching test)
- Delete Song from Playlist
- Delete Playlist

**📁 Collaborations**
- Add Collaborator
- Get Playlist Activities (with caching test)
- Delete Collaborator

**📁 Exports**
- Export Playlist to Email
- Check Export Status

**📁 Performance Tests**
- Cache Hit/Miss Verification
- Response Time Comparison
- Concurrent Request Testing

#### Setup Environment Variables
Pastikan environment variables sudah sesuai:
```json
{
  "baseUrl": "http://localhost:5000",
  "accessToken": "",
  "refreshToken": "",
  "userId": "",
  "albumId": "",
  "songId": "",
  "playlistId": ""
}
```

#### Menjalankan Test
1. **Pastikan server berjalan**:
   ```bash
   npm start
   ```

2. **Run All Tests**:
   - Buka collection "Open Music API V3 Test"
   - Klik tombol "Run" (▶️) di collection
   - Pilih "Run Open Music API V3 Test"
   - Klik "Run Open Music API V3 Test" untuk menjalankan semua test

3. **Test Sequence**:
   - ✅ **User Registration & Authentication**
   - ✅ **Albums CRUD Operations**
   - ✅ **Album Cover Upload**
   - ✅ **Album Likes System**
   - ✅ **Songs CRUD Operations**
   - ✅ **Playlists Management**
   - ✅ **Playlist Collaborations**
   - ✅ **Playlist Export**
   - ✅ **Caching Verification**

#### Test Files untuk Upload
Collection menyediakan test files:
- `picture-large.jpg` - Test file upload besar
- `picture-small.jpg` - Test file upload kecil
- `text-small.txt` - Test invalid file type

#### Expected Results
- ✅ **537 tests** harus pass
- ✅ **Authentication flow** berjalan lancar
- ✅ **CRUD operations** berhasil
- ✅ **File upload** validation bekerja
- ✅ **Caching** menunjukkan response time improvement
- ✅ **Export** menghasilkan email notification

#### Troubleshooting Testing

**Jika ada test yang gagal:**

1. **Environment Variables tidak ter-set**:
   ```bash
   # Pastikan environment sudah dipilih
   # Check di dropdown environment Postman
   ```

2. **Server tidak berjalan**:
   ```bash
   # Pastikan server aktif
   npm start
   # Check di http://localhost:5000
   ```

3. **Database belum di-setup**:
   ```bash
   # Jalankan migrasi database
   npm run migrate up
   ```

4. **Redis/RabbitMQ tidak aktif**:
   ```bash
   # Windows - Check services
   # Redis: redis-server
   # RabbitMQ: rabbitmq-server
   ```

5. **Test sequence error**:
   - Jalankan test secara berurutan
   - Jangan skip authentication tests
   - Pastikan user registration berhasil dulu

**Tips untuk Testing yang Optimal:**
- 🔄 **Reset environment** sebelum run all tests
- 📧 **Setup email config** untuk test export
- 🗂️ **Buat folder uploads** jika belum ada
- ⚡ **Clear Redis cache** sebelum test caching
- 📊 **Monitor response times** untuk verifikasi performa

#### Interpretasi Hasil Test

**✅ Success Indicators:**
```
✓ Status Code: 200/201/400/401/403/404 (sesuai expected)
✓ Response Time: < 200ms (dengan cache), < 1000ms (tanpa cache)
✓ Cache Headers: X-Data-Source: cache/database
✓ Authentication: Bearer token valid
✓ File Upload: Content-Type validation
✓ Export: Queue job created successfully
```

**❌ Common Failures:**
```
✗ Connection refused → Server tidak berjalan
✗ 500 Internal Error → Database/Redis/RabbitMQ issue
✗ 401 Unauthorized → Token expired/invalid
✗ 413 Payload Too Large → File upload > 512KB
✗ Timeout → Cache/Database performance issue
```

**📊 Performance Benchmarks:**
- **Cached Endpoints**: Response time < 50ms
- **Database Queries**: Response time < 500ms
- **File Uploads**: < 2 seconds untuk file 512KB
- **Export Jobs**: Queue processing < 1 second

**🔍 Monitoring During Tests:**
```bash
# Monitor Redis
redis-cli monitor

# Monitor RabbitMQ
# Access: http://localhost:15672 (guest/guest)

# Monitor Application Logs
npm start # Check console output
```

### Testing Cache Performance
```bash
# Test endpoint tanpa cache
curl -w "@curl-format.txt" http://localhost:5000/albums/1

# Test endpoint dengan cache (second request)
curl -w "@curl-format.txt" http://localhost:5000/albums/1
```

## API Documentation (OpenAPI/Swagger) 🆕

### Overview
Dokumentasi API lengkap tersedia dalam format OpenAPI 3.0 (Swagger) yang dibuat berdasarkan koleksi testing Postman V3. Dokumentasi mencakup semua endpoint, parameter, contoh request/response, dan model data.

### File Dokumentasi
```
docs/openapi/
├── openmusic-api-v3.yaml          # Dokumentasi format YAML
├── openmusic-api-v3.json          # Dokumentasi format JSON
└── README.md                      # Panduan penggunaan
```

### Fitur Dokumentasi
- **✅ 25+ Endpoints** - Semua endpoint dari koleksi Postman V3
- **✅ Request/Response Schemas** - Model data lengkap untuk semua endpoint
- **✅ Authentication** - JWT Bearer Token dengan contoh
- **✅ Error Handling** - Semua kode status HTTP yang mungkin
- **✅ Examples** - Contoh request dan response untuk setiap endpoint
- **✅ Caching Headers** - Header `X-Data-Source` untuk endpoint yang di-cache
- **✅ File Upload** - Spesifikasi upload cover album dengan validasi
- **✅ V3 Features** - Dokumentasi fitur baru seperti likes, exports, uploads

### Cara Menggunakan

#### 1. Swagger UI Online
```bash
# Buka Swagger Editor
https://editor.swagger.io/

# Copy-paste isi file openmusic-api-v3.yaml
# Dokumentasi akan ter-render otomatis
```

#### 2. Local Development
```bash
# Menggunakan Docker
docker run -p 8080:8080 -e SWAGGER_JSON=/docs/openmusic-api-v3.json \
  -v $(pwd)/docs/openapi:/docs swaggerapi/swagger-ui

# Akses: http://localhost:8080
```

#### 3. VS Code Extension
```bash
# Install extension "Swagger Viewer"
# Buka file openmusic-api-v3.yaml
# Command Palette: "Swagger: Preview"
```

### Endpoint Coverage
Dokumentasi mencakup semua endpoint dari testing Postman:

**🎵 Albums (5 endpoints)**
- `POST /albums` - Tambah album
- `GET /albums/{albumId}` - Detail album (cached)
- `PUT /albums/{albumId}` - Edit album
- `DELETE /albums/{albumId}` - Hapus album
- `POST /albums/{albumId}/covers` - Upload cover

**❤️ Album Likes (3 endpoints)**
- `POST /albums/{albumId}/likes` - Like album
- `DELETE /albums/{albumId}/likes` - Unlike album
- `GET /albums/{albumId}/likes` - Jumlah likes

**🎶 Songs (5 endpoints)**
- `POST /songs` - Tambah lagu
- `GET /songs` - Daftar lagu dengan filter (cached)
- `GET /songs/{songId}` - Detail lagu (cached)
- `PUT /songs/{songId}` - Edit lagu
- `DELETE /songs/{songId}` - Hapus lagu

**👤 Users & Auth (4 endpoints)**
- `POST /users` - Registrasi pengguna
- `POST /authentications` - Login
- `PUT /authentications` - Refresh token
- `DELETE /authentications` - Logout

**📝 Playlists (7 endpoints)**
- `POST /playlists` - Tambah playlist
- `GET /playlists` - Daftar playlist (cached)
- `DELETE /playlists/{playlistId}` - Hapus playlist
- `POST /playlists/{playlistId}/songs` - Tambah lagu ke playlist
- `GET /playlists/{playlistId}/songs` - Lagu dalam playlist (cached)
- `DELETE /playlists/{playlistId}/songs/{songId}` - Hapus lagu dari playlist
- `GET /playlists/{playlistId}/activities` - Aktivitas playlist (cached)

**🤝 Collaborations (2 endpoints)**
- `POST /collaborations` - Tambah kolaborator
- `DELETE /collaborations` - Hapus kolaborator

**📤 Exports (1 endpoint)**
- `POST /export/playlists/{playlistId}` - Export playlist ke email

### Integration dengan Development
```javascript
// Tambahkan ke aplikasi Express untuk development
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/openapi/openmusic-api-v3.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Akses: http://localhost:5000/api-docs
```

### Sinkronisasi dengan Testing
Dokumentasi OpenAPI ini:
- **📊 Dibuat dari 200+ test cases** Postman V3
- **🔄 Selalu sinkron** dengan koleksi testing terbaru
- **✅ Teruji dengan real API responses** dari testing aktual
- **🛡️ Mencerminkan validation rules** yang sudah diverifikasi

### Monitoring
- **Redis**: Monitor cache hit/miss ratio
- **RabbitMQ**: Monitor queue status via management UI
- **Application**: Check logs untuk performance metrics
- **Postman**: Monitor test results dan response times

### V3 Development Guidelines 🆕
- **Code Style**: Follow ESLint configuration
- **Caching**: Implement caching untuk new GET endpoints
- **Error Handling**: Proper error handling untuk new services
- **Documentation**: Update README untuk new features
- **Testing**: Test cache invalidation dan performance

---

## Changelog

### V3.0.0 (Latest) 🆕
- ⚡ Added Redis caching untuk semua GET endpoints
- 📁 Added album cover upload functionality
- ❤️ Added album likes system
- 📤 Added playlist export dengan RabbitMQ
- 🔧 Added ESLint integration
- 📧 Added email notification system
- 🏗️ Enhanced project structure dan configuration

### V2.0.0
- 🔐 Added user authentication dan authorization
- 📝 Added playlist management system
- 🤝 Added collaboration features
- 📊 Added activity logging
- 🔒 Added JWT token management

### V1.0.0
- 🎵 Basic album dan song management
- 🗄️ PostgreSQL database integration
- ✅ Input validation dengan Joi
- 🚀 Hapi.js framework setup
