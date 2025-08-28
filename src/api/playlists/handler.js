const autoBind = require('auto-bind');

class PlaylistsHandler {
  constructor(service, validator, cacheService) {
    this._service = service;
    this._validator = validator;
    this._cacheService = cacheService;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    // Invalidate cache
    await this._cacheService.delete(`playlists:${credentialId}`);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const cacheKey = `playlists:${credentialId}`;

    try {
      const result = await this._cacheService.get(cacheKey);
      const playlists = JSON.parse(result);

      const response = h.response({
        status: 'success',
        data: {
          playlists,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (cacheError) {
      const playlists = await this._service.getPlaylists(credentialId);
      await this._cacheService.set(cacheKey, JSON.stringify(playlists), 1800); // 30 minutes

      const response = h.response({
        status: 'success',
        data: {
          playlists,
        },
      });
      response.header('X-Data-Source', 'database');
      return response;
    }
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(id, credentialId);
    await this._service.deletePlaylistById(id);

    // Invalidate cache
    await this._cacheService.delete(`playlists:${credentialId}`);
    await this._cacheService.delete(`playlist_songs:${id}`);
    await this._cacheService.delete(`playlist_activities:${id}`);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validatePostSongToPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addSongToPlaylist(playlistId, songId);
    await this._service.addPlaylistSongActivity(
      playlistId,
      songId,
      credentialId,
      'add',
    );

    // Invalidate cache
    await this._cacheService.delete(`playlist_songs:${playlistId}`);
    await this._cacheService.delete(`playlist_activities:${playlistId}`);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsFromPlaylistHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const cacheKey = `playlist_songs:${playlistId}`;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    try {
      const result = await this._cacheService.get(cacheKey);
      const playlistData = JSON.parse(result);

      const response = h.response({
        status: 'success',
        data: {
          playlist: playlistData,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (cacheError) {
      const playlist = await this._service.getPlaylistById(playlistId);
      const songs = await this._service.getSongsFromPlaylist(playlistId);
      const playlistData = {
        ...playlist,
        songs,
      };
      await this._cacheService.set(cacheKey, JSON.stringify(playlistData), 1800); // 30 minutes

      const response = h.response({
        status: 'success',
        data: {
          playlist: playlistData,
        },
      });
      response.header('X-Data-Source', 'database');
      return response;
    }
  }

  async deleteSongFromPlaylistHandler(request) {
    this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongFromPlaylist(playlistId, songId);
    await this._service.addPlaylistSongActivity(
      playlistId,
      songId,
      credentialId,
      'delete',
    );

    // Invalidate cache
    await this._cacheService.delete(`playlist_songs:${playlistId}`);
    await this._cacheService.delete(`playlist_activities:${playlistId}`);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const cacheKey = `playlist_activities:${playlistId}`;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);

    try {
      const result = await this._cacheService.get(cacheKey);
      const activities = JSON.parse(result);

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
          activities,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (cacheError) {
      const activities = await this._service.getPlaylistSongActivities(playlistId);
      await this._cacheService.set(cacheKey, JSON.stringify(activities), 1800); // 30 minutes

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
          activities,
        },
      });
      response.header('X-Data-Source', 'database');
      return response;
    }
  }
}

module.exports = PlaylistsHandler;