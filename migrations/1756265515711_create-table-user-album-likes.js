/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Buat tabel user_album_likes
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Tambahkan foreign key constraints
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes_album_id', {
    foreignKeys: {
      columns: 'album_id',
      references: 'albums(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  });

  // Buat indeks untuk performa
  pgm.createIndex('user_album_likes', 'user_id');
  pgm.createIndex('user_album_likes', 'album_id');
  pgm.createIndex('user_album_likes', 'created_at');

  // Buat unique constraint untuk mencegah duplikasi like
  pgm.addConstraint('user_album_likes', 'unique_user_album_like', {
    unique: ['user_id', 'album_id'],
  });
};

exports.down = pgm => {
  // Hapus tabel user_album_likes (akan otomatis menghapus semua constraint dan indeks)
  pgm.dropTable('user_album_likes');
};
