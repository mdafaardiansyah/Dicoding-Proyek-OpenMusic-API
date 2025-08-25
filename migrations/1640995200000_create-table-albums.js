/**
 * Migration untuk membuat tabel albums
 * Tabel ini menyimpan data album musik
 */

exports.up = (pgm) => {
  // Membuat tabel albums
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      comment: 'Primary key untuk tabel albums, menggunakan nanoid',
    },
    name: {
      type: 'TEXT',
      notNull: true,
      comment: 'Nama album, wajib diisi',
    },
    year: {
      type: 'INTEGER',
      notNull: true,
      comment: 'Tahun rilis album, wajib diisi',
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

  // Menambahkan index untuk performa query
  pgm.createIndex('albums', 'name');
  pgm.createIndex('albums', 'year');
};

exports.down = (pgm) => {
  // Menghapus tabel albums  
  pgm.dropTable('albums');
};
