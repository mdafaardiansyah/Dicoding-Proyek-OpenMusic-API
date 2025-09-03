// @ts-check
const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid');
const { getAuthToken, registerUser, createSong, createPlaylist, addSongToPlaylist } = require('./utils');

test.describe('Export API Tests', () => {
  // Data pengujian
  const testUser = {
    username: `user_${uuidv4().substring(0, 8)}`,
    password: 'password123',
    fullname: 'Export Test User',
  };
  
  let accessToken;
  let playlistId;
  let songId;

  // Setup: Registrasi dan login user sebelum pengujian
  test.beforeAll(async ({ request }) => {
    // Registrasi user
    await registerUser(request, testUser.username, testUser.password, testUser.fullname);
    
    // Login untuk mendapatkan token
    accessToken = await getAuthToken(request, testUser.username, testUser.password);
    
    // Buat lagu untuk pengujian
    const songResponse = await request.post('/songs', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title: 'Test Song for Export',
        year: 2023,
        genre: 'Pop',
        performer: 'Test Singer',
        duration: 240,
        albumId: null,
      },
    });
    
    const songData = await songResponse.json();
    songId = songData.data.songId;
    
    // Buat playlist untuk pengujian
    const playlistResponse = await request.post('/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        name: 'Test Playlist for Export',
      },
    });
    
    const playlistData = await playlistResponse.json();
    playlistId = playlistData.data.playlistId;
    
    // Tambahkan lagu ke playlist
    await request.post(`/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        songId,
      },
    });
  });

  test('should export playlist', async ({ request }) => {
    const exportData = {
      targetEmail: 'test@example.com',
    };

    const response = await request.post(`/export/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: exportData,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.message).toContain('Permintaan Anda sedang kami proses');
  });

  test('should not export non-existent playlist', async ({ request }) => {
    const nonExistentPlaylistId = 'playlist-12345';
    const exportData = {
      targetEmail: 'test@example.com',
    };

    const response = await request.post(`/export/playlists/${nonExistentPlaylistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: exportData,
    });

    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should not export playlist with invalid email', async ({ request }) => {
    const exportData = {
      targetEmail: 'invalid-email',
    };

    const response = await request.post(`/export/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: exportData,
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should not export playlist without authentication', async ({ request }) => {
    const exportData = {
      targetEmail: 'test@example.com',
    };

    const response = await request.post(`/export/playlists/${playlistId}`, {
      data: exportData,
    });

    expect(response.status()).toBe(401);
  });

  test('should not export playlist with invalid token', async ({ request }) => {
    const exportData = {
      targetEmail: 'test@example.com',
    };

    const response = await request.post(`/export/playlists/${playlistId}`, {
      headers: {
        Authorization: 'Bearer invalid-token',
      },
      data: exportData,
    });

    expect(response.status()).toBe(401);
  });

  // Cleanup: Hapus playlist dan lagu yang dibuat untuk pengujian
  test.afterAll(async ({ request }) => {
    await request.delete(`/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    await request.delete(`/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  });
});