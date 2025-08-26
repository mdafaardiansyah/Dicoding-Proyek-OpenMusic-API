# OpenMusic API (V2)

OpenMusic API adalah RESTful API untuk mengelola data musik yang dibangun menggunakan Node.js dan Hapi.js framework. API ini menyediakan fitur lengkap untuk mengelola album, lagu, user authentication, playlist, dan kolaborasi dengan operasi CRUD lengkap. API ini merupakan Submission ke-2 dari Kelas Belajar Fundamental Back-End dengan JavaScript di Dicoding.

## 🆕 Apa yang Baru di V2?

Versi 2 dari OpenMusic API menghadirkan peningkatan signifikan dengan fitur-fitur baru:

### ✨ Fitur Baru
- **User Authentication**: Sistem registrasi dan login dengan JWT
- **Playlist Management**: Membuat dan mengelola playlist pribadi
- **Collaboration System**: Berbagi playlist dengan pengguna lain
- **Activity Logging**: Melacak aktivitas pada playlist
- **Enhanced Security**: Password hashing dengan bcrypt
- **Token Management**: Access token dan refresh token

### 🔄 Perubahan dari V1
- **Database Schema**: 5 tabel baru (users, authentications, playlists, playlist_songs, collaborations, playlist_song_activities)
- **Authentication Middleware**: JWT-based authentication untuk endpoint yang dilindungi
- **Enhanced Album Response**: Album detail sekarang menyertakan daftar lagu
- **Improved Error Handling**: Error handling yang lebih robust dengan proper HTTP status codes
- **New Dependencies**: @hapi/jwt, bcrypt untuk security features

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

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Hapi.js
- **Database**: PostgreSQL
- **Authentication**: @hapi/jwt
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Migration**: node-pg-migrate
- **Environment**: dotenv
- **Token Management**: JWT (JSON Web Tokens)

## API Endpoints

### 🎵 Albums (Public)

- `POST /albums` - Menambahkan album baru
- `GET /albums/{id}` - Mendapatkan album berdasarkan ID (dengan daftar lagu)
- `PUT /albums/{id}` - Mengupdate album berdasarkan ID
- `DELETE /albums/{id}` - Menghapus album berdasarkan ID

### 🎶 Songs (Public)

- `POST /songs` - Menambahkan lagu baru
- `GET /songs` - Mendapatkan semua lagu (dengan fitur pencarian)
- `GET /songs/{id}` - Mendapatkan lagu berdasarkan ID
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

### 📝 Playlists (V2 - Protected)

- `POST /playlists` - Membuat playlist baru 🔒
- `GET /playlists` - Mendapatkan daftar playlist pengguna 🔒
- `DELETE /playlists/{id}` - Menghapus playlist 🔒
- `POST /playlists/{id}/songs` - Menambahkan lagu ke playlist 🔒
- `GET /playlists/{id}/songs` - Mendapatkan lagu dalam playlist 🔒
- `DELETE /playlists/{id}/songs` - Menghapus lagu dari playlist 🔒
- `GET /playlists/{id}/activities` - Mendapatkan aktivitas playlist 🔒

### 🤝 Collaborations (V2 - Protected)

- `POST /collaborations` - Menambahkan kolaborator ke playlist 🔒
- `DELETE /collaborations` - Menghapus kolaborator dari playlist 🔒

> 🔒 = Memerlukan authentication header

## Installation

1. Clone repository
```bash
git clone <repository-url>
cd openmusic-api
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

4. Configure database connection di file `.env`

5. Run database migrations
```bash
npm run migrate up
```

6. Start server
```bash
# Development
npm run start:dev

# Production
npm start
```

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

# Node Environment
NODE_ENV=development
```

## Database Schema

### 🎵 Core Tables (V1)

#### Albums Table
```sql
CREATE TABLE albums (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
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

## Project Structure

```
src/
├── api/
│   ├── albums/              # V1 - Album endpoints
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── routes.js
│   ├── songs/               # V1 - Song endpoints
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── routes.js
│   ├── users/               # V2 - User management
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── routes.js
│   ├── authentications/     # V2 - Auth endpoints
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── routes.js
│   ├── playlists/           # V2 - Playlist management
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── routes.js
│   └── collaborations/      # V2 - Collaboration system
│       ├── handler.js
│       ├── index.js
│       └── routes.js
├── exceptions/
│   ├── AuthenticationError.js  # V2 - New exception
│   ├── AuthorizationError.js   # V2 - New exception
│   ├── ClientError.js
│   ├── InvariantError.js
│   ├── NotFoundError.js
│   └── index.js
├── services/
│   ├── AlbumsService.js        # V1 - Enhanced with songs
│   ├── SongsService.js         # V1
│   ├── UsersService.js         # V2 - User management
│   ├── AuthenticationsService.js # V2 - Token management
│   ├── PlaylistsService.js     # V2 - Playlist operations
│   ├── CollaborationsService.js # V2 - Collaboration logic
│   └── index.js
├── tokenize/                   # V2 - JWT utilities
│   └── TokenManager.js
├── utils/
│   ├── database.js
│   └── index.js
├── validator/
│   ├── albums/
│   ├── songs/
│   ├── users/               # V2 - User validation
│   ├── authentications/     # V2 - Auth validation
│   ├── playlists/           # V2 - Playlist validation
│   ├── collaborations/      # V2 - Collaboration validation
│   └── index.js
└── server.js                   # Enhanced with JWT auth
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

## Migration Guide: V1 → V2

### Breaking Changes
- **Album Response**: GET /albums/{id} sekarang menyertakan array songs
- **New Dependencies**: Perlu install @hapi/jwt dan bcrypt
- **Environment Variables**: Tambahkan JWT configuration
- **Database**: 5 tabel baru perlu di-migrate

### Migration Steps
1. Install dependencies baru: `npm install @hapi/jwt bcrypt`
2. Update environment variables dengan JWT keys
3. Run database migrations: `npm run migrate up`
4. Update client code untuk handle new album response format
5. Implement authentication flow untuk protected endpoints

## Security Features (V2)

- **Password Hashing**: Menggunakan bcrypt dengan salt rounds
- **JWT Tokens**: Access token (30 menit) dan refresh token
- **Route Protection**: Middleware authentication untuk endpoint sensitif
- **Input Validation**: Enhanced validation dengan Joi schemas
- **SQL Injection Prevention**: Parameterized queries dengan pg
- **CORS Handling**: Proper CORS configuration
