/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create index on id
  pgm.createIndex('collaborations', 'id');

  // Create index on playlist_id for faster lookups
  pgm.createIndex('collaborations', 'playlist_id');

  // Create index on user_id for faster lookups
  pgm.createIndex('collaborations', 'user_id');

  // Add foreign key constraints
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

  // Add unique constraint to prevent duplicate collaborations
  pgm.addConstraint('collaborations', 'unique_collaboration', 'UNIQUE(playlist_id, user_id)');
};

exports.down = pgm => {
  pgm.dropTable('collaborations');
};
