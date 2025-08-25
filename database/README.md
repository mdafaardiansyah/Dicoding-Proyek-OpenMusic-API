# Database Setup Guide

## Overview
Panduan ini menjelaskan cara setup database PostgreSQL untuk OpenMusic API secara manual.

## Prerequisites
- Akses ke PostgreSQL server di `153.92.5.249:5432`
- Database `dicoding_submission_1` sudah tersedia
- Kredensial database:
  - User: `postgresql_glanze`
  - Password: `1233yuhanN212!`
  - Host: `153.92.5.249`
  - Port: `5432`
  - Database: `dicoding_submission_1`

## Setup Database

### 1. Manual Setup via psql

```bash
# Connect to PostgreSQL
psql -U postgresql_glanze -h 153.92.5.249 -p 5432 -d dicoding_submission_1

# Run the SQL script
\i database/create-tables.sql

# Verify tables created
\dt
```

### 2. Setup via Node.js Script (Jika PostgreSQL server berjalan)

```bash
# Setup database
npm run db:setup

# Reset database (hapus dan buat ulang)
npm run db:reset
```

### 3. Manual SQL Execution

Jika menggunakan GUI tools seperti pgAdmin atau DBeaver, jalankan script berikut:

```sql
-- Buat tabel albums
CREATE TABLE IF NOT EXISTS albums (
    id VARCHAR(50) PRIMARY KEY,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_albums_name ON albums(name);
CREATE INDEX IF NOT EXISTS idx_albums_year ON albums(year);

-- Buat tabel songs
CREATE TABLE IF NOT EXISTS songs (
    id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    genre TEXT NOT NULL,
    performer TEXT NOT NULL,
    duration INTEGER,
    album_id VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_songs_album_id FOREIGN KEY (album_id) 
        REFERENCES albums(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_performer ON songs(performer);
CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);

-- Function untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk albums
CREATE TRIGGER update_albums_updated_at 
    BEFORE UPDATE ON albums 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk songs
CREATE TRIGGER update_songs_updated_at 
    BEFORE UPDATE ON songs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Database Schema

### Albums Table
- `id` (VARCHAR(50), PRIMARY KEY): Unique identifier menggunakan nanoid
- `name` (TEXT, NOT NULL): Nama album
- `year` (INTEGER, NOT NULL): Tahun rilis
- `created_at` (TIMESTAMP): Waktu pembuatan record
- `updated_at` (TIMESTAMP): Waktu update terakhir

### Songs Table
- `id` (VARCHAR(50), PRIMARY KEY): Unique identifier menggunakan nanoid
- `title` (TEXT, NOT NULL): Judul lagu
- `year` (INTEGER, NOT NULL): Tahun rilis
- `genre` (TEXT, NOT NULL): Genre lagu
- `performer` (TEXT, NOT NULL): Penyanyi/performer
- `duration` (INTEGER, NULLABLE): Durasi dalam detik
- `album_id` (VARCHAR(50), NULLABLE): Foreign key ke albums
- `created_at` (TIMESTAMP): Waktu pembuatan record
- `updated_at` (TIMESTAMP): Waktu update terakhir

## Relationships
- Songs.album_id → Albums.id (ONE-TO-MANY)
- ON DELETE SET NULL: Jika album dihapus, album_id di songs menjadi NULL
- ON UPDATE CASCADE: Jika id album diupdate, album_id di songs ikut terupdate

## Indexes
Index dibuat untuk optimasi performa query:
- Albums: name, year
- Songs: title, performer, album_id, genre

## Auto-Update Timestamp
Trigger otomatis mengupdate kolom `updated_at` setiap kali record dimodifikasi.

## Verification

Setelah setup, verifikasi dengan query berikut:

```sql
-- Cek tabel yang dibuat
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Cek struktur tabel albums
\d albums

-- Cek struktur tabel songs
\d songs

-- Cek foreign key constraints
SELECT conname, conrelid::regclass, confrelid::regclass 
FROM pg_constraint 
WHERE contype = 'f';
```