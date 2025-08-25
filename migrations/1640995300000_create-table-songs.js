/**
 * Migration untuk membuat tabel songs
 * Tabel ini menyimpan data lagu dengan relasi ke tabel albums
 */

exports.up = (pgm) => {
  // Membuat tabel songs
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      comment: 'Primary key untuk tabel songs, menggunakan nanoid',
    },
    title: {
      type: 'TEXT',
      notNull: true,
      comment: 'Judul lagu, wajib diisi',
    },
    year: {
      type: 'INTEGER',
      notNull: true,
      comment: 'Tahun rilis lagu, wajib diisi',
    },
    genre: {
      type: 'TEXT',
      notNull: true,
      comment: 'Genre lagu, wajib diisi',
    },
    performer: {
      type: 'TEXT',
      notNull: true,
      comment: 'Penyanyi/performer lagu, wajib diisi',
    },
    duration: {
      type: 'INTEGER',
      comment: 'Durasi lagu dalam detik, opsional',
    },
    album_id: {
      type: 'VARCHAR(50)',
      comment: 'Foreign key ke tabel albums, opsional',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'Waktu pembuatan record',
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
      comment: 'Waktu update terakhir record',
    },
  });

  // Menambahkan foreign key constraint ke tabel albums
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'SET NULL', // Jika album dihapus, album_id di songs menjadi NULL
      onUpdate: 'CASCADE', // Jika id album diupdate, album_id di songs ikut terupdate
    },
  });

  // Menambahkan index untuk performa query
  pgm.createIndex('songs', 'title');
  pgm.createIndex('songs', 'performer');
  pgm.createIndex('songs', 'album_id');
  pgm.createIndex('songs', 'genre');
};

exports.down = (pgm) => {
  // Menghapus tabel songs jika rollback
  pgm.dropTable('songs');
};