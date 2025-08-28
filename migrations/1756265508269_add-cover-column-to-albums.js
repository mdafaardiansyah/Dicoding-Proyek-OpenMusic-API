/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Tambahkan kolom cover ke tabel albums
  pgm.addColumn('albums', {
    cover: {
      type: 'TEXT',
      notNull: false,
    },
  });
  
  // Buat indeks untuk kolom cover
  pgm.createIndex('albums', 'cover');
};

exports.down = pgm => {
  // Hapus indeks terlebih dahulu
  pgm.dropIndex('albums', 'cover');
  
  // Kemudian hapus kolom cover
  pgm.dropColumn('albums', 'cover');
};
