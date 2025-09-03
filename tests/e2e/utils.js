// @ts-check
const { expect } = require('@playwright/test');

/**
 * Fungsi untuk mendapatkan token autentikasi
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} username
 * @param {string} password
 * @returns {Promise<string>} Token autentikasi
 */
async function getAuthToken(request, username, password) {
  // Login untuk mendapatkan token
  const loginResponse = await request.post('/authentications', {
    data: {
      username,
      password,
    },
  });
  
  expect(loginResponse.ok()).toBeTruthy();
  const loginData = await loginResponse.json();
  return loginData.data.accessToken;
}

/**
 * Fungsi untuk mendaftarkan pengguna baru
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} username
 * @param {string} password
 * @param {string} fullname
 * @returns {Promise<Object>} Data pengguna yang terdaftar
 */
async function registerUser(request, username, password, fullname) {
  const registerResponse = await request.post('/users', {
    data: {
      username,
      password,
      fullname,
    },
  });
  
  expect(registerResponse.ok()).toBeTruthy();
  return registerResponse.json();
}

/**
 * Fungsi untuk membuat album baru
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} token
 * @param {string} name
 * @param {string} year
 * @returns {Promise<Object>} Data album yang dibuat
 */
async function createAlbum(request, token, name, year) {
  const albumResponse = await request.post('/albums', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      name,
      year,
    },
  });
  
  expect(albumResponse.ok()).toBeTruthy();
  return albumResponse.json();
}

/**
 * Fungsi untuk membuat lagu baru
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} token
 * @param {string} title
 * @param {string} year
 * @param {string} genre
 * @param {string} performer
 * @param {string} duration
 * @param {string} albumId
 * @returns {Promise<Object>} Data lagu yang dibuat
 */
async function createSong(request, token, title, year, genre, performer, duration, albumId) {
  const songResponse = await request.post('/songs', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    },
  });
  
  expect(songResponse.ok()).toBeTruthy();
  return songResponse.json();
}

/**
 * Fungsi untuk membuat playlist baru
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} token
 * @param {string} name
 * @returns {Promise<Object>} Data playlist yang dibuat
 */
async function createPlaylist(request, token, name) {
  const playlistResponse = await request.post('/playlists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      name,
    },
  });
  
  expect(playlistResponse.ok()).toBeTruthy();
  return playlistResponse.json();
}

/**
 * Fungsi untuk menambahkan lagu ke playlist
 * @param {import('@playwright/test').APIRequestContext} request
 * @param {string} token
 * @param {string} playlistId
 * @param {string} songId
 * @returns {Promise<Object>} Status penambahan lagu
 */
async function addSongToPlaylist(request, token, playlistId, songId) {
  const addSongResponse = await request.post(`/playlists/${playlistId}/songs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      songId,
    },
  });
  
  expect(addSongResponse.ok()).toBeTruthy();
  return addSongResponse.json();
}

module.exports = {
  getAuthToken,
  registerUser,
  createAlbum,
  createSong,
  createPlaylist,
  addSongToPlaylist,
};