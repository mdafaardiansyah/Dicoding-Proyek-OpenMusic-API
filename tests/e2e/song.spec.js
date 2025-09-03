// @ts-check
const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid');
const { getAuthToken, registerUser, createAlbum } = require('./utils');

test.describe('Song API Tests', () => {
  // Data pengujian
  const testUser = {
    username: `user_${uuidv4().substring(0, 8)}`,
    password: 'password123',
    fullname: 'Test User',
  };
  
  let accessToken;
  let albumId;
  let songId;

  // Setup: Registrasi dan login user sebelum pengujian
  test.beforeAll(async ({ request }) => {
    // Registrasi user
    await registerUser(request, testUser.username, testUser.password, testUser.fullname);
    
    // Login untuk mendapatkan token
    accessToken = await getAuthToken(request, testUser.username, testUser.password);
    
    // Buat album untuk pengujian lagu
    const albumResponse = await request.post('/albums', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        name: 'Album for Songs Test',
        year: 2023,
      },
    });
    
    const albumData = await albumResponse.json();
    albumId = albumData.data.albumId;
  });

  test('should create a new song', async ({ request }) => {
    const songData = {
      title: 'Test Song',
      year: 2023,
      genre: 'Pop',
      performer: 'Test Singer',
      duration: 240,
      albumId,
    };

    const response = await request.post('/songs', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: songData,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('songId');
    
    // Simpan ID lagu untuk pengujian selanjutnya
    songId = responseBody.data.songId;
  });

  test('should not create song with invalid data', async ({ request }) => {
    const invalidSongData = {
      // Tidak ada title
      year: 2023,
      performer: 'Test Singer',
    };

    const response = await request.post('/songs', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: invalidSongData,
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should get all songs', async ({ request }) => {
    const response = await request.get('/songs', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('songs');
    expect(Array.isArray(responseBody.data.songs)).toBeTruthy();
  });

  test('should search songs by title', async ({ request }) => {
    const response = await request.get('/songs?title=Test', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('songs');
    expect(Array.isArray(responseBody.data.songs)).toBeTruthy();
    
    // Verifikasi hasil pencarian mengandung lagu yang kita buat
    const foundSong = responseBody.data.songs.find(song => song.id === songId);
    expect(foundSong).toBeTruthy();
  });

  test('should search songs by performer', async ({ request }) => {
    const response = await request.get('/songs?performer=Test', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('songs');
    
    // Verifikasi hasil pencarian mengandung lagu yang kita buat
    const foundSong = responseBody.data.songs.find(song => song.id === songId);
    expect(foundSong).toBeTruthy();
  });

  test('should get song by ID', async ({ request }) => {
    const response = await request.get(`/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('song');
    expect(responseBody.data.song).toHaveProperty('id', songId);
    expect(responseBody.data.song).toHaveProperty('title', 'Test Song');
    expect(responseBody.data.song).toHaveProperty('performer', 'Test Singer');
  });

  test('should not get non-existent song', async ({ request }) => {
    const nonExistentId = 'song-123456';
    const response = await request.get(`/songs/${nonExistentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should update song', async ({ request }) => {
    const updatedSongData = {
      title: 'Updated Test Song',
      year: 2024,
      genre: 'Rock',
      performer: 'Updated Test Singer',
      duration: 300,
      albumId,
    };

    const response = await request.put(`/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: updatedSongData,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should verify song was updated', async ({ request }) => {
    const response = await request.get(`/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data.song).toHaveProperty('title', 'Updated Test Song');
    expect(responseBody.data.song).toHaveProperty('performer', 'Updated Test Singer');
    expect(responseBody.data.song).toHaveProperty('genre', 'Rock');
  });

  test('should delete song', async ({ request }) => {
    const response = await request.delete(`/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should verify song was deleted', async ({ request }) => {
    const response = await request.get(`/songs/${songId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  // Cleanup: Hapus album yang dibuat untuk pengujian
  test.afterAll(async ({ request }) => {
    await request.delete(`/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  });
});