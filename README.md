# OpenMusic API

OpenMusic API adalah RESTful API untuk mengelola data musik yang dibangun menggunakan Node.js dan Hapi.js framework. API ini menyediakan fitur untuk mengelola album dan lagu dengan operasi CRUD lengkap.

## Fitur

- **Albums Management**: CRUD operations untuk album
- **Songs Management**: CRUD operations untuk lagu dengan fitur pencarian
- **Database Integration**: PostgreSQL dengan connection pooling
- **Input Validation**: Joi schema validation
- **Error Handling**: Custom exceptions dan proper HTTP status codes
- **Auto-binding**: Automatic method binding untuk handler classes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Hapi.js
- **Database**: PostgreSQL
- **Validation**: Joi
- **Migration**: node-pg-migrate
- **Environment**: dotenv

## API Endpoints

### Albums

- `POST /albums` - Menambahkan album baru
- `GET /albums/{id}` - Mendapatkan album berdasarkan ID
- `PUT /albums/{id}` - Mengupdate album berdasarkan ID
- `DELETE /albums/{id}` - Menghapus album berdasarkan ID

### Songs

- `POST /songs` - Menambahkan lagu baru
- `GET /songs` - Mendapatkan semua lagu (dengan fitur pencarian)
- `GET /songs/{id}` - Mendapatkan lagu berdasarkan ID
- `PUT /songs/{id}` - Mengupdate lagu berdasarkan ID
- `DELETE /songs/{id}` - Menghapus lagu berdasarkan ID

#### Query Parameters untuk GET /songs

- `title` - Pencarian berdasarkan judul lagu
- `performer` - Pencarian berdasarkan nama performer

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

# Node Environment
NODE_ENV=development
```

## Database Schema

### Albums Table
```sql
CREATE TABLE albums (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Songs Table
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

## Project Structure

```
src/
├── api/
│   ├── albums/
│   │   ├── handler.js
│   │   ├── index.js
│   │   └── routes.js
│   └── songs/
│       ├── handler.js
│       ├── index.js
│       └── routes.js
├── exceptions/
│   ├── ClientError.js
│   ├── InvariantError.js
│   ├── NotFoundError.js
│   └── index.js
├── services/
│   ├── AlbumsService.js
│   ├── SongsService.js
│   └── index.js
├── utils/
│   ├── database.js
│   └── index.js
├── validator/
│   ├── albums/
│   │   ├── index.js
│   │   └── schema.js
│   ├── songs/
│   │   ├── index.js
│   │   └── schema.js
│   └── index.js
└── server.js
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

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
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
```
