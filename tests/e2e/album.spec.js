// @ts-check
const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const { getAuthToken, registerUser } = require('./utils');

test.describe('Album API Tests', () => {
  // Data pengujian
  const testUser = {
    username: `user_${uuidv4().substring(0, 8)}`,
    password: 'password123',
    fullname: 'Test User',
  };
  
  let accessToken;
  let albumId;

  // Setup: Registrasi dan login user sebelum pengujian
  test.beforeAll(async ({ request }) => {
    // Registrasi user
    await registerUser(request, testUser.username, testUser.password, testUser.fullname);
    
    // Login untuk mendapatkan token
    accessToken = await getAuthToken(request, testUser.username, testUser.password);
  });

  test('should create a new album', async ({ request }) => {
    const albumData = {
      name: 'Album Test',
      year: 2023,
    };

    const response = await request.post('/albums', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: albumData,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('albumId');
    
    // Simpan ID album untuk pengujian selanjutnya
    albumId = responseBody.data.albumId;
  });

  test('should not create album with invalid data', async ({ request }) => {
    const invalidAlbumData = {
      // Tidak ada name
      year: 2023,
    };

    const response = await request.post('/albums', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: invalidAlbumData,
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should get album by ID', async ({ request }) => {
    const response = await request.get(`/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data.album).toHaveProperty('id', albumId);
    expect(responseBody.data.album).toHaveProperty('name', 'Album Test');
    expect(responseBody.data.album).toHaveProperty('year', 2023);
  });

  test('should not get non-existent album', async ({ request }) => {
    const nonExistentId = 'album-123456';
    const response = await request.get(`/albums/${nonExistentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should update album', async ({ request }) => {
    const updatedAlbumData = {
      name: 'Updated Album Test',
      year: 2024,
    };

    const response = await request.put(`/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: updatedAlbumData,
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should verify album was updated', async ({ request }) => {
    const response = await request.get(`/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data.album).toHaveProperty('name', 'Updated Album Test');
    expect(responseBody.data.album).toHaveProperty('year', 2024);
  });

  test('should upload album cover', async ({ request }) => {
    // Buat file cover sementara untuk pengujian
    const testCoverPath = path.join(process.cwd(), 'test-cover.jpg');
    const imageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    fs.writeFileSync(testCoverPath, imageBuffer);

    // Buat FormData untuk upload file
    const formData = new FormData();
    const blob = new Blob([fs.readFileSync(testCoverPath)], { type: 'image/jpeg' });
    formData.append('cover', blob, 'cover.jpg');

    const response = await request.post(`/albums/${albumId}/covers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      multipart: {
        cover: {
          name: 'cover.jpg',
          mimeType: 'image/jpeg',
          buffer: imageBuffer,
        },
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');

    // Hapus file cover sementara
    fs.unlinkSync(testCoverPath);
  });

  test('should like an album', async ({ request }) => {
    const response = await request.post(`/albums/${albumId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should get album likes count', async ({ request }) => {
    const response = await request.get(`/albums/${albumId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('likes');
    expect(responseBody.data.likes).toBeGreaterThanOrEqual(1);
  });

  test('should unlike an album', async ({ request }) => {
    const response = await request.delete(`/albums/${albumId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should delete album', async ({ request }) => {
    const response = await request.delete(`/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should verify album was deleted', async ({ request }) => {
    const response = await request.get(`/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.status()).toBe(404);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });
});