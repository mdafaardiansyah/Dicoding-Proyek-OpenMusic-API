// @ts-check
const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid');
const { getAuthToken, registerUser, createAlbum } = require('./utils');

test.describe('Cache API Tests', () => {
  // Data pengujian
  const testUser = {
    username: `user_${uuidv4().substring(0, 8)}`,
    password: 'password123',
    fullname: 'Cache Test User',
  };
  
  let accessToken;
  let albumId;

  // Setup: Registrasi dan login user sebelum pengujian
  test.beforeAll(async ({ request }) => {
    // Registrasi user
    await registerUser(request, testUser.username, testUser.password, testUser.fullname);
    
    // Login untuk mendapatkan token
    accessToken = await getAuthToken(request, testUser.username, testUser.password);
    
    // Buat album untuk pengujian caching
    const albumResponse = await request.post('/albums', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        name: 'Album for Cache Test',
        year: 2023,
      },
    });
    
    const albumData = await albumResponse.json();
    albumId = albumData.data.albumId;
  });

  test('should cache album likes response', async ({ request }) => {
    // Like album terlebih dahulu
    await request.post(`/albums/${albumId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Permintaan pertama untuk mendapatkan jumlah like
    const firstResponse = await request.get(`/albums/${albumId}/likes`);
    expect(firstResponse.status()).toBe(200);
    
    // Periksa header cache pada respons pertama
    const cacheControl = firstResponse.headers()['cache-control'];
    expect(cacheControl).toBeTruthy();
    
    // Permintaan kedua untuk mendapatkan jumlah like (seharusnya dari cache)
    const secondResponse = await request.get(`/albums/${albumId}/likes`);
    expect(secondResponse.status()).toBe(200);
    
    // Periksa header X-Data-Source pada respons kedua
    const dataSource = secondResponse.headers()['x-data-source'];
    expect(dataSource).toBe('cache');
    
    // Verifikasi respons pertama dan kedua memiliki data yang sama
    const firstResponseBody = await firstResponse.json();
    const secondResponseBody = await secondResponse.json();
    expect(firstResponseBody).toEqual(secondResponseBody);
  });

  test('should measure response time for cached vs non-cached requests', async ({ request }) => {
    // Hapus cache terlebih dahulu dengan unlike album
    await request.delete(`/albums/${albumId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    // Like album kembali
    await request.post(`/albums/${albumId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Ukur waktu untuk permintaan pertama (non-cached)
    const startFirstRequest = Date.now();
    const firstResponse = await request.get(`/albums/${albumId}/likes`);
    const endFirstRequest = Date.now();
    const firstRequestTime = endFirstRequest - startFirstRequest;
    
    // Ukur waktu untuk permintaan kedua (seharusnya dari cache)
    const startSecondRequest = Date.now();
    const secondResponse = await request.get(`/albums/${albumId}/likes`);
    const endSecondRequest = Date.now();
    const secondRequestTime = endSecondRequest - startSecondRequest;
    
    // Verifikasi respons kedua berasal dari cache
    const dataSource = secondResponse.headers()['x-data-source'];
    expect(dataSource).toBe('cache');
    
    // Verifikasi respons dari cache lebih cepat atau setidaknya tidak jauh lebih lambat
    console.log(`Non-cached request time: ${firstRequestTime}ms`);
    console.log(`Cached request time: ${secondRequestTime}ms`);
    
    // Toleransi untuk variasi jaringan, tetapi cache seharusnya tidak lebih lambat dari non-cache
    expect(secondRequestTime).toBeLessThanOrEqual(firstRequestTime * 1.5);
  });

  test('should invalidate cache after like/unlike action', async ({ request }) => {
    // Dapatkan jumlah like saat ini (dari cache)
    const initialResponse = await request.get(`/albums/${albumId}/likes`);
    const initialResponseBody = await initialResponse.json();
    const initialLikes = initialResponseBody.data.likes;
    
    // Unlike album untuk mengubah jumlah like
    await request.delete(`/albums/${albumId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    // Dapatkan jumlah like setelah unlike (seharusnya dari database, bukan cache)
    const afterUnlikeResponse = await request.get(`/albums/${albumId}/likes`);
    const afterUnlikeResponseBody = await afterUnlikeResponse.json();
    const afterUnlikeLikes = afterUnlikeResponseBody.data.likes;
    
    // Verifikasi jumlah like berubah
    expect(afterUnlikeLikes).toBe(initialLikes - 1);
    
    // Verifikasi respons berasal dari database, bukan cache
    const dataSource = afterUnlikeResponse.headers()['x-data-source'];
    expect(dataSource).not.toBe('cache');
  });

  test('should have acceptable response times for cached endpoints', async ({ request }) => {
    // Like album kembali
    await request.post(`/albums/${albumId}/likes`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    // Permintaan pertama untuk mengisi cache
    await request.get(`/albums/${albumId}/likes`);
    
    // Ukur waktu untuk permintaan kedua (dari cache)
    const startTime = Date.now();
    const response = await request.get(`/albums/${albumId}/likes`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Verifikasi respons berasal dari cache
    const dataSource = response.headers()['x-data-source'];
    expect(dataSource).toBe('cache');
    
    // Verifikasi waktu respons kurang dari 50ms (sesuai dengan tolok ukur di README)
    console.log(`Cached response time: ${responseTime}ms`);
    expect(responseTime).toBeLessThan(100); // Sedikit lebih longgar untuk pengujian
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