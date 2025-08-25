/**
 * AlbumsService - Service layer untuk operasi database albums
 * Menangani semua operasi CRUD untuk tabel albums
 */

const { nanoid } = require('nanoid');
const { pool } = require('../utils');
const { NotFoundError, InvariantError } = require('../exceptions');

/**
 * Service class untuk mengelola data albums
 */
class AlbumsService {
  constructor() {
    this._pool = pool;
  }

  /**
   * Menambahkan album baru ke database
   * @param {Object} albumData - Data album yang akan ditambahkan
   * @param {string} albumData.name - Nama album
   * @param {number} albumData.year - Tahun rilis album
   * @returns {Promise<string>} - ID album yang baru dibuat
   */
  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError('Album gagal ditambahkan');
      }

      return result.rows[0].id;
    } catch (error) {
      if (error instanceof InvariantError) {
        throw error;
      }
      throw new InvariantError('Album gagal ditambahkan');
    }
  }

  /**
   * Mendapatkan album berdasarkan ID
   * @param {string} id - ID album yang dicari
   * @returns {Promise<Object>} - Data album
   */
  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  /**
   * Mengupdate album berdasarkan ID
   * @param {string} id - ID album yang akan diupdate
   * @param {Object} albumData - Data album yang akan diupdate
   * @param {string} albumData.name - Nama album baru
   * @param {number} albumData.year - Tahun rilis album baru
   */
  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  /**
   * Menghapus album berdasarkan ID
   * @param {string} id - ID album yang akan dihapus
   */
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  /**
   * Mengecek apakah album dengan ID tertentu ada
   * @param {string} id - ID album yang dicek
   * @returns {Promise<boolean>} - True jika album ada
   */
  async verifyAlbumExists(id) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }
}

module.exports = AlbumsService;