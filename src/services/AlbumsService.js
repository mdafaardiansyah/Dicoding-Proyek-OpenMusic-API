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
  constructor(poolInstance, cacheService) {
    this._pool = poolInstance || pool;
    this._cacheService = cacheService;
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
      text: 'SELECT id, name, year, cover FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = result.rows[0];
    
    // Rename cover field to coverUrl as per PRD specification
    // Set coverUrl to null if cover is null/undefined
    album.coverUrl = album.cover || null;
    delete album.cover;

    return album;
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
   * @throws {NotFoundError} - Jika album tidak ditemukan
   */
  async verifyAlbumExists(id) {
    const query = {
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  /**
   * Mengupload cover album
   * @param {string} id - ID album
   * @param {string} coverUrl - URL cover album
   */
  async addAlbumCover(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal mengunggah cover. Id tidak ditemukan');
    }
  }

  /**
   * Menambahkan like pada album
   * @param {string} userId - ID user
   * @param {string} albumId - ID album
   */
  async addAlbumLike(userId, albumId) {
    // Verify album exists
    await this.verifyAlbumExists(albumId);
    
    // Check if user already liked this album
    const hasLiked = await this.verifyAlbumLike(userId, albumId);
    if (hasLiked) {
      throw new InvariantError('Anda sudah menyukai album ini');
    }
    
    const id = `like-${nanoid(16)}`;
    
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan like');
    }
  }

  /**
   * Menghapus like pada album
   * @param {string} userId - ID user
   * @param {string} albumId - ID album
   */
  async deleteAlbumLike(userId, albumId) {
    // Verify album exists
    await this.verifyAlbumExists(albumId);
    
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus like');
    }
  }

  /**
   * Mengecek apakah user sudah like album
   * @param {string} userId - ID user
   * @param {string} albumId - ID album
   * @returns {Promise<boolean>} - True jika sudah like
   */
  async verifyAlbumLike(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    return result.rows.length > 0;
  }

  /**
   * Mendapatkan jumlah like album
   * @param {string} albumId - ID album
   * @returns {Promise<number>} - Jumlah like
   */
  async getAlbumLikes(albumId) {
    // Verify album exists
    await this.verifyAlbumExists(albumId);
    
    const query = {
      text: 'SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].count, 10);
  }
}

module.exports = AlbumsService;