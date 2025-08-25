/**
 * Migration untuk membuat tabel albums
 * Tabel ini menyimpan data album musik
 */

exports.up = (pgm) => {
  // Membuat tabel albums dengan IF NOT EXISTS menggunakan SQL raw
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS "albums" (
      "id" VARCHAR(50) PRIMARY KEY,
      "name" TEXT NOT NULL,
      "year" INTEGER NOT NULL,
      "created_at" TIMESTAMP DEFAULT current_timestamp NOT NULL,
      "updated_at" TIMESTAMP DEFAULT current_timestamp NOT NULL
    );
  `);

  // Menambahkan komentar pada kolom
  pgm.sql(`
    COMMENT ON COLUMN "albums"."id" IS 'Primary key untuk tabel albums, menggunakan nanoid';
    COMMENT ON COLUMN "albums"."name" IS 'Nama album, wajib diisi';
    COMMENT ON COLUMN "albums"."year" IS 'Tahun rilis album, wajib diisi';
    COMMENT ON COLUMN "albums"."created_at" IS 'Waktu pembuatan record';
    COMMENT ON COLUMN "albums"."updated_at" IS 'Waktu update terakhir record';
  `);

  // Menambahkan index untuk performa query
  pgm.sql('CREATE INDEX IF NOT EXISTS idx_albums_name ON albums(name);');
  pgm.sql('CREATE INDEX IF NOT EXISTS idx_albums_year ON albums(year);');
};

exports.down = (pgm) => {
  // Menghapus tabel albums  
  pgm.dropTable('albums');
};
