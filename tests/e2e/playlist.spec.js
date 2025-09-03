// @ts-check
const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid');
const { getAuthToken, registerUser, createSong } = require('./utils');

test.describe('Playlist API Tests', () => {
  // Data pengujian
  const testUser = {
    username: `user_${uuidv4().substring(0, 8)}`,
    password: 'password123',
    fullname: 'Playlist Test User',
  };
  
  const collaboratorUser = {
    username: `collab_${uuidv4().substring(0, 8)}`,
    password: 'password123',
    fullname: 'Collaborator User',
  };
  
  let accessToken;
  let collaboratorToken;
  let playlistId;
  let songId;

  // Setup: Registrasi dan login user sebelum pengujian
  test.beforeAll(async ({ request }) => {
    // Registrasi user utama
    await registerUser(request, testUser.username, testUser.password, testUser.fullname);
    
    // Registrasi user kolaborator
    await registerUser(request, collaboratorUser.username, collaboratorUser.password, collaboratorUser.fullname);
    
    // Login untuk mendapatkan token user utama
    accessToken = await getAuthToken(request, testUser.username, testUser.password);
    
    // Login untuk mendapatkan token user kolaborator
    collaboratorToken = await getAuthToken(request, collaboratorUser.username, collaboratorUser.password);
    
    // Buat lagu untuk pengujian playlist
    const songResponse = await request.post('/songs', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        title: 'Test Song for Playlist',
        year: 2023,
        genre: 'Pop',
        performer: 'Test Singer',
        duration: 240,
        albumId: null,
      },
    });
    
    const songData = await songResponse.json();
    songId = songData.data.songId;
  });

  test('should create a new playlist', async ({ request }) => {
    const playlistData = {
      name: 'Test Playlist',
    };

    const response = await request.post('/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: playlistData,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('playlistId');
    
    // Simpan ID playlist untuk pengujian selanjutnya
    playlistId = responseBody.data.playlistId;
  });

  test('should not create playlist with invalid data', async ({ request }) => {
    const invalidPlaylistData = {
      // Tidak ada name
    };

    const response = await request.post('/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: invalidPlaylistData,
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should get all playlists', async ({ request }) => {
    const response = await request.get('/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('playlists');
    expect(Array.isArray(responseBody.data.playlists)).toBeTruthy();
    
    // Verifikasi playlist yang baru dibuat ada dalam daftar
    const foundPlaylist = responseBody.data.playlists.find(playlist => playlist.id === playlistId);
    expect(foundPlaylist).toBeTruthy();
  });

  test('should add song to playlist', async ({ request }) => {
    const response = await request.post(`/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        songId,
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should not add non-existent song to playlist', async ({ request }) => {
    const nonExistentSongId = 'song-12345';
    const response = await request.post(`/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        songId: nonExistentSongId,
      },
    });

    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should get songs in playlist', async ({ request }) => {
    const response = await request.get(`/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('songs');
    expect(Array.isArray(responseBody.data.songs)).toBeTruthy();
    expect(responseBody.data.songs.length).toBeGreaterThan(0);
    
    // Verifikasi lagu yang ditambahkan ada dalam playlist
    const foundSong = responseBody.data.songs.find(song => song.id === songId);
    expect(foundSong).toBeTruthy();
  });

  test('should delete song from playlist', async ({ request }) => {
    const response = await request.delete(`/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        songId,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should verify song was removed from playlist', async ({ request }) => {
    const response = await request.get(`/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data).toHaveProperty('songs');
    
    // Verifikasi lagu tidak ada lagi dalam playlist
    const songs = responseBody.data.songs;
    const foundSong = songs.find(song => song.id === songId);
    expect(foundSong).toBeFalsy();
  });

  test('should add collaborator to playlist', async ({ request }) => {
    // Dapatkan user ID dari kolaborator
    const userResponse = await request.get('/users', {
      headers: {
        Authorization: `Bearer ${collaboratorToken}`,
      },
    });
    
    const userData = await userResponse.json();
    const collaboratorId = userData.data.userId;
    
    const response = await request.post(`/collaborations`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        playlistId,
        userId: collaboratorId,
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('collaborationId');
  });

  test('should allow collaborator to access playlist', async ({ request }) => {
    const response = await request.get('/playlists', {
      headers: {
        Authorization: `Bearer ${collaboratorToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    
    // Verifikasi kolaborator dapat melihat playlist
    const playlists = responseBody.data.playlists;
    const foundPlaylist = playlists.find(playlist => playlist.id === playlistId);
    expect(foundPlaylist).toBeTruthy();
  });

  test('should allow collaborator to add song to playlist', async ({ request }) => {
    // Tambahkan kembali lagu ke playlist sebagai kolaborator
    const response = await request.post(`/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${collaboratorToken}`,
      },
      data: {
        songId,
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should delete collaborator from playlist', async ({ request }) => {
    // Dapatkan user ID dari kolaborator
    const userResponse = await request.get('/users', {
      headers: {
        Authorization: `Bearer ${collaboratorToken}`,
      },
    });
    
    const userData = await userResponse.json();
    const collaboratorId = userData.data.userId;
    
    const response = await request.delete(`/collaborations`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        playlistId,
        userId: collaboratorId,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should verify collaborator no longer has access to playlist', async ({ request }) => {
    const response = await request.get(`/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${collaboratorToken}`,
      },
    });

    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should delete playlist', async ({ request }) => {
    const response = await request.delete(`/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should verify playlist was deleted', async ({ request }) => {
    const response = await request.get('/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    
    // Verifikasi playlist tidak ada lagi dalam daftar
    const playlists = responseBody.data.playlists;
    const foundPlaylist = playlists.find(playlist => playlist.id === playlistId);
    expect(foundPlaylist).toBeFalsy();
  });

  // Cleanup: Hapus lagu yang dibuat untuk pengujian
  test.afterAll(async ({ request }) => {
    await request.delete(`/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  });
});