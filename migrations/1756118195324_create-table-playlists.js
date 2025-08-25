/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create index on id
  pgm.createIndex('playlists', 'id');

  // Create index on owner for faster lookups
  pgm.createIndex('playlists', 'owner');

  // Add foreign key constraint
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  // Create trigger for updated_at
  pgm.sql(`
    CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE
    ON playlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `);
};

exports.down = pgm => {
  pgm.dropTable('playlists');
};
