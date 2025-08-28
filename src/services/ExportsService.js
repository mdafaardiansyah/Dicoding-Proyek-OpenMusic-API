const ProducerService = require('./rabbitmq/ProducerService');

class ExportsService {
  constructor() {
    this._queue = 'export:playlists';
  }

  async exportPlaylist(playlistId, targetEmail) {
    const message = {
      playlistId,
      targetEmail,
    };

    await ProducerService.sendMessage(this._queue, JSON.stringify(message));
  }
}

module.exports = ExportsService;