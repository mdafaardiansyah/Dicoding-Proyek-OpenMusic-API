/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
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

  pgm.createIndex('albums', 'id');
};

exports.down = pgm => {
  pgm.dropTable('albums');
};
