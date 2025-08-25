/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
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
  pgm.createIndex('playlist_songs', 'id');

  // Create index on playlist_id for faster lookups
  pgm.createIndex('playlist_songs', 'playlist_id');

  // Create index on song_id for faster lookups
  pgm.createIndex('playlist_songs', 'song_id');

  // Add foreign key constraints
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');

  // Add unique constraint to prevent duplicate songs in same playlist
  pgm.addConstraint('playlist_songs', 'unique_playlist_song', 'UNIQUE(playlist_id, song_id)');
};

exports.down = pgm => {
  pgm.dropTable('playlist_songs');
};
