const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    // Verifikasi kepemilikan playlist
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this._service.exportPlaylist(playlistId, targetEmail);

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;