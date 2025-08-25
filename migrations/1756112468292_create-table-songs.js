/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
    },
    album_id: {
      type: 'VARCHAR(50)',
      references: 'albums(id)',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.createIndex('songs', 'id');
  pgm.createIndex('songs', 'album_id');
};

exports.down = pgm => {
  pgm.dropTable('songs');
};
