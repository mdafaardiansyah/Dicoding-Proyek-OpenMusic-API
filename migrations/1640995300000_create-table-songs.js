/**
 * Migration untuk membuat tabel songs
 * Tabel ini menyimpan data lagu dengan relasi ke tabel albums
 */

exports.up = (pgm) => {
  // Membuat tabel songs dengan IF NOT EXISTS menggunakan SQL raw
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS "songs" (
      "id" VARCHAR(50) PRIMARY KEY,
      "title" TEXT NOT NULL,
      "year" INTEGER NOT NULL,
      "genre" TEXT NOT NULL,
      "performer" TEXT NOT NULL,
      "duration" INTEGER,
      "album_id" VARCHAR(50),
      "created_at" TIMESTAMP DEFAULT current_timestamp NOT NULL,
      "updated_at" TIMESTAMP DEFAULT current_timestamp NOT NULL,
      CONSTRAINT fk_songs_album_id FOREIGN KEY (album_id) 
        REFERENCES albums(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
    );
  `);

  // Menambahkan komentar pada kolom
  pgm.sql(`
    COMMENT ON COLUMN "songs"."id" IS 'Primary key untuk tabel songs, menggunakan nanoid';
    COMMENT ON COLUMN "songs"."title" IS 'Judul lagu, wajib diisi';
    COMMENT ON COLUMN "songs"."year" IS 'Tahun rilis lagu, wajib diisi';
    COMMENT ON COLUMN "songs"."genre" IS 'Genre lagu, wajib diisi';
    COMMENT ON COLUMN "songs"."performer" IS 'Penyanyi/performer lagu, wajib diisi';
    COMMENT ON COLUMN "songs"."duration" IS 'Durasi lagu dalam detik, opsional';
    COMMENT ON COLUMN "songs"."album_id" IS 'Foreign key ke tabel albums, opsional';
    COMMENT ON COLUMN "songs"."created_at" IS 'Waktu pembuatan record';
    COMMENT ON COLUMN "songs"."updated_at" IS 'Waktu update terakhir record';
  `);

  // Menambahkan index untuk performa query
  pgm.sql('CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);');
  pgm.sql('CREATE INDEX IF NOT EXISTS idx_songs_performer ON songs(performer);');
  pgm.sql('CREATE INDEX IF NOT EXISTS idx_songs_album_id ON songs(album_id);');
  pgm.sql('CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);');
};

exports.down = (pgm) => {
  // Menghapus tabel songs jika rollback
  pgm.dropTable('songs');
};