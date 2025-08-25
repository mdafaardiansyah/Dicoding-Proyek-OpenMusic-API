# OpenMusic API Migration System

## Overview
Sistem migration OpenMusic API dirancang untuk mengelola perubahan database secara terstruktur dan terdokumentasi. Sistem ini mendukung setup manual tanpa ORM dengan menggunakan raw SQL dan Node.js scripts.

## Struktur Migration System

```
database/
├── README.md                 # Panduan setup database
├── MIGRATION-SYSTEM.md      # Dokumentasi sistem migration (file ini)
├── create-tables.sql        # SQL script untuk membuat tabel
├── setup-database.js        # Script Node.js untuk setup database
├── reset-database.js        # Script Node.js untuk reset database
└── test-database.js         # Script Node.js untuk test database

migrations/
├── 1640995200000_create-table-albums.js   # Migration file untuk tabel albums
└── 1640995300000_create-table-songs.js    # Migration file untuk tabel songs

migrations-config.json       # Konfigurasi node-pg-migrate
```

## Migration Scripts

### 1. SQL-based Migration (Recommended)

#### Setup Database
```bash
# Menggunakan Node.js script
npm run db:setup

# Atau manual via psql
psql -U postgres -d dicoding_submission_1 -f database/create-tables.sql
```

#### Reset Database
```bash
# Menggunakan Node.js script
npm run db:reset

# Atau manual via psql
psql -U postgres -d dicoding_submission_1 -c "DROP TABLE IF EXISTS songs CASCADE; DROP TABLE IF EXISTS albums CASCADE;"
psql -U postgres -d dicoding_submission_1 -f database/create-tables.sql
```

#### Test Database
```bash
# Test operasi database
npm run db:test
```

### 2. node-pg-migrate (Alternative)

```bash
# Run migrations (memerlukan PostgreSQL server aktif)
npm run migrate:up

# Rollback migrations
npm run migrate:down

# Create new migration
npm run migrate:create nama-migration
```

## Database Schema Management

### Current Schema Version: 1.0

#### Tables:
1. **albums**
   - Primary key: `id` (VARCHAR(50))
   - Fields: `name`, `year`, `created_at`, `updated_at`
   - Indexes: `name`, `year`
   - Triggers: Auto-update `updated_at`

2. **songs**
   - Primary key: `id` (VARCHAR(50))
   - Fields: `title`, `year`, `genre`, `performer`, `duration`, `album_id`
   - Foreign key: `album_id` → `albums.id`
   - Indexes: `title`, `performer`, `album_id`, `genre`
   - Triggers: Auto-update `updated_at`

#### Relationships:
- Albums → Songs (One-to-Many)
- Foreign key constraints dengan ON DELETE SET NULL dan ON UPDATE CASCADE

## Migration Best Practices

### 1. Naming Convention
- Migration files: `{timestamp}_{description}.js`
- SQL files: `{action}-{object}.sql`
- Scripts: `{action}-database.js`

### 2. Version Control
- Semua migration files di-commit ke repository
- Tidak mengubah migration yang sudah di-deploy
- Membuat migration baru untuk perubahan schema

### 3. Rollback Strategy
- Setiap migration memiliki fungsi `up` dan `down`
- Test rollback di development environment
- Backup database sebelum migration di production

### 4. Testing
- Test migration di development environment
- Verifikasi data integrity setelah migration
- Test aplikasi setelah schema changes

## Environment Configuration

### Development
```env
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=dicoding_submission_1
PGHOST=localhost
PGPORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dicoding_submission_1
```

### Production
```env
PGUSER=your_prod_user
PGPASSWORD=your_secure_password
PGDATABASE=openmusic_production
PGHOST=your_prod_host
PGPORT=5432
DATABASE_URL=postgresql://user:pass@host:port/database
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```
   Error: connect ECONNREFUSED
   ```
   - Pastikan PostgreSQL server berjalan
   - Cek konfigurasi host dan port
   - Verifikasi credentials di .env

2. **Permission Denied**
   ```
   Error: permission denied for relation
   ```
   - Pastikan user memiliki privilege yang cukup
   - Grant permissions: `GRANT ALL ON DATABASE dbname TO username;`

3. **Table Already Exists**
   ```
   Error: relation "table_name" already exists
   ```
   - Gunakan `CREATE TABLE IF NOT EXISTS`
   - Atau jalankan `npm run db:reset`

### Debug Commands

```bash
# Cek koneksi database
psql -U postgres -d dicoding_submission_1 -c "SELECT current_database(), current_user;"

# Cek tabel yang ada
psql -U postgres -d dicoding_submission_1 -c "\dt"

# Cek struktur tabel
psql -U postgres -d dicoding_submission_1 -c "\d albums"
psql -U postgres -d dicoding_submission_1 -c "\d songs"

# Test koneksi via Node.js
npm run db:test
```

## Migration Workflow

### Development Workflow
1. Buat perubahan schema di development
2. Update SQL scripts di `database/`
3. Test migration dengan `npm run db:reset`
4. Verifikasi dengan `npm run db:test`
5. Commit changes ke repository

### Production Deployment
1. Backup production database
2. Deploy aplikasi dengan migration scripts
3. Run migration: `npm run db:setup`
4. Verifikasi deployment
5. Monitor aplikasi

## Future Enhancements

### Planned Features
- [ ] Automated backup before migration
- [ ] Migration rollback automation
- [ ] Schema versioning system
- [ ] Migration status tracking
- [ ] Data seeding scripts

### Schema Evolution
- [ ] User authentication tables
- [ ] Playlist management
- [ ] User favorites
- [ ] Album covers and metadata
- [ ] Audio file management

## Support

Untuk pertanyaan atau issues terkait migration system:
1. Cek dokumentasi ini terlebih dahulu
2. Jalankan `npm run db:test` untuk diagnosa
3. Cek logs aplikasi untuk error details
4. Konsultasi dengan database administrator jika diperlukan