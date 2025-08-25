/**
 * SongsService - Service layer untuk operasi database songs
 * Menangani semua operasi CRUD untuk tabel songs dengan fitur pencarian
 */

const { nanoid } = require('nanoid');
const { pool } = require('../utils');
const { NotFoundError, InvariantError } = require('../exceptions');

/**
 * Service class untuk mengelola data songs
 */
class SongsService {
  constructor() {
    this._pool = pool;
  }

  /**
   * Menambahkan lagu baru ke database
   * @param {Object} songData - Data lagu yang akan ditambahkan
   * @param {string} songData.title - Judul lagu
   * @param {number} songData.year - Tahun rilis lagu
   * @param {string} songData.genre - Genre lagu
   * @param {string} songData.performer - Penyanyi/performer lagu
   * @param {number} [songData.duration] - Durasi lagu dalam detik (opsional)
   * @param {string} [songData.albumId] - ID album (opsional)
   * @returns {Promise<string>} - ID lagu yang baru dibuat
   */
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError('Lagu gagal ditambahkan');
      }

      return result.rows[0].id;
    } catch (error) {
      if (error instanceof InvariantError) {
        throw error;
      }
      throw new InvariantError('Lagu gagal ditambahkan');
    }
  }

  /**
   * Mendapatkan semua lagu dengan fitur pencarian
   * @param {Object} [params] - Parameter pencarian
   * @param {string} [params.title] - Filter berdasarkan judul lagu
   * @param {string} [params.performer] - Filter berdasarkan performer
   * @returns {Promise<Array>} - Array data lagu
   */
  async getSongs({ title, performer } = {}) {
    let query = {
      text: 'SELECT id, title, performer FROM songs',
      values: [],
    };

    const conditions = [];
    const values = [];

    // Filter berdasarkan title (case insensitive)
    if (title) {
      conditions.push(`title ILIKE $${values.length + 1}`);
      values.push(`%${title}%`);
    }

    // Filter berdasarkan performer (case insensitive)
    if (performer) {
      conditions.push(`performer ILIKE $${values.length + 1}`);
      values.push(`%${performer}%`);
    }

    // Tambahkan WHERE clause jika ada kondisi
    if (conditions.length > 0) {
      query.text += ` WHERE ${conditions.join(' AND ')}`;
      query.values = values;
    }

    // Urutkan berdasarkan title
    query.text += ' ORDER BY title ASC';

    const result = await this._pool.query(query);
    return result.rows;
  }

  /**
   * Mendapatkan lagu berdasarkan ID
   * @param {string} id - ID lagu yang dicari
   * @returns {Promise<Object>} - Data lagu lengkap
   */
  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, genre, performer, duration, album_id FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    // Konversi album_id ke albumId untuk konsistensi response
    const song = result.rows[0];
    return {
      id: song.id,
      title: song.title,
      year: song.year,
      genre: song.genre,
      performer: song.performer,
      duration: song.duration,
      albumId: song.album_id,
    };
  }

  /**
   * Mengupdate lagu berdasarkan ID
   * @param {string} id - ID lagu yang akan diupdate
   * @param {Object} songData - Data lagu yang akan diupdate
   * @param {string} songData.title - Judul lagu baru
   * @param {number} songData.year - Tahun rilis lagu baru
   * @param {string} songData.genre - Genre lagu baru
   * @param {string} songData.performer - Penyanyi/performer lagu baru
   * @param {number} [songData.duration] - Durasi lagu baru (opsional)
   * @param {string} [songData.albumId] - ID album baru (opsional)
   */
  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  /**
   * Menghapus lagu berdasarkan ID
   * @param {string} id - ID lagu yang akan dihapus
   */
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  /**
   * Mendapatkan lagu-lagu dalam album tertentu
   * @param {string} albumId - ID album
   * @returns {Promise<Array>} - Array lagu dalam album
   */
  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1 ORDER BY title ASC',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = SongsService;