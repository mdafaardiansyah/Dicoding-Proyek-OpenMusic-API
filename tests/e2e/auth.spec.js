// @ts-check
const { test, expect } = require('@playwright/test');
const { v4: uuidv4 } = require('uuid');

test.describe('Authentication API Tests', () => {
  // Data pengujian
  const testUser = {
    username: `user_${uuidv4().substring(0, 8)}`,
    password: 'password123',
    fullname: 'Test User',
  };
  
  let accessToken;
  let refreshToken;

  test('should register a new user', async ({ request }) => {
    const response = await request.post('/users', {
      data: testUser,
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('userId');
  });

  test('should not register user with existing username', async ({ request }) => {
    const response = await request.post('/users', {
      data: testUser,
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
    expect(responseBody.message).toContain('gagal ditambahkan');
  });

  test('should login with valid credentials', async ({ request }) => {
    const response = await request.post('/authentications', {
      data: {
        username: testUser.username,
        password: testUser.password,
      },
    });

    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('accessToken');
    expect(responseBody.data).toHaveProperty('refreshToken');
    
    accessToken = responseBody.data.accessToken;
    refreshToken = responseBody.data.refreshToken;
  });

  test('should not login with invalid credentials', async ({ request }) => {
    const response = await request.post('/authentications', {
      data: {
        username: testUser.username,
        password: 'wrongpassword',
      },
    });

    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
    expect(responseBody.message).toContain('kredensial');
  });

  test('should refresh access token', async ({ request }) => {
    const response = await request.put('/authentications', {
      data: {
        refreshToken,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
    expect(responseBody.data).toHaveProperty('accessToken');
    
    // Update access token dengan yang baru
    accessToken = responseBody.data.accessToken;
  });

  test('should not refresh token with invalid refresh token', async ({ request }) => {
    const response = await request.put('/authentications', {
      data: {
        refreshToken: 'invalid-refresh-token',
      },
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });

  test('should logout successfully', async ({ request }) => {
    const response = await request.delete('/authentications', {
      data: {
        refreshToken,
      },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('success');
  });

  test('should not logout with invalid refresh token', async ({ request }) => {
    const response = await request.delete('/authentications', {
      data: {
        refreshToken: 'invalid-refresh-token',
      },
    });

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody.status).toBe('fail');
  });
});