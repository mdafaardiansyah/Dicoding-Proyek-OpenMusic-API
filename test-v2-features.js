const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test data with unique usernames
const timestamp = Date.now();
const testUser = {
  username: `testuser${timestamp}`,
  password: 'testpassword123',
  fullname: 'Test User'
};

const testUser2 = {
  username: `testuser2${timestamp}`,
  password: 'testpassword456',
  fullname: 'Test User 2'
};

const testPlaylist = {
  name: 'My Test Playlist'
};

let accessToken = '';
let refreshToken = '';
let userId = '';
let userId2 = '';
let playlistId = '';
let songId = '';

// Helper function untuk logging
function log(message, data = null) {
  console.log(`\n✅ ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

function logError(message, error) {
  console.log(`\n❌ ${message}`);
  console.log(error.response?.data || error.message);
}

async function testV2Features() {
  try {
    console.log('🚀 Starting OpenMusic API v2 Feature Testing...');
    
    // Test 1: Check API Info
    log('Testing API Info endpoint');
    const apiInfo = await axios.get(BASE_URL);
    log('API Info retrieved', apiInfo.data);
    
    // Test 2: User Registration
    log('Testing User Registration');
    const userResponse = await axios.post(`${BASE_URL}/users`, testUser);
    userId = userResponse.data.data.userId;
    log('User registered successfully', userResponse.data);
    
    // Test 3: Register second user for collaboration test
    log('Registering second user for collaboration test');
    const user2Response = await axios.post(`${BASE_URL}/users`, testUser2);
    userId2 = user2Response.data.data.userId;
    log('Second user registered', user2Response.data);
    
    // Test 4: User Authentication (Login)
    log('Testing User Login');
    const authResponse = await axios.post(`${BASE_URL}/authentications`, {
      username: testUser.username,
      password: testUser.password
    });
    accessToken = authResponse.data.data.accessToken;
    refreshToken = authResponse.data.data.refreshToken;
    log('User logged in successfully', authResponse.data);
    
    // Test 5: Get User by ID
    log('Testing Get User by ID');
    const userDetailResponse = await axios.get(`${BASE_URL}/users/${userId}`);
    log('User details retrieved', userDetailResponse.data);
    
    // Test 6: Create Playlist
    log('Testing Create Playlist');
    const playlistResponse = await axios.post(`${BASE_URL}/playlists`, testPlaylist, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    playlistId = playlistResponse.data.data.playlistId;
    log('Playlist created successfully', playlistResponse.data);
    
    // Test 7: Get Playlists
    log('Testing Get Playlists');
    const playlistsResponse = await axios.get(`${BASE_URL}/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    log('Playlists retrieved', playlistsResponse.data);
    
    // Test 8: Add Song to Database (prerequisite for playlist songs)
    log('Adding test song to database');
    const songResponse = await axios.post(`${BASE_URL}/songs`, {
      title: 'Test Song',
      year: 2024,
      performer: 'Test Artist',
      genre: 'Test Genre',
      duration: 180
    });
    songId = songResponse.data.data.songId;
    log('Test song added', songResponse.data);
    
    // Test 9: Add Song to Playlist
    log('Testing Add Song to Playlist');
    const addSongResponse = await axios.post(`${BASE_URL}/playlists/${playlistId}/songs`, {
      songId: songId
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    log('Song added to playlist', addSongResponse.data);
    
    // Test 10: Get Songs in Playlist
    log('Testing Get Songs in Playlist');
    const playlistSongsResponse = await axios.get(`${BASE_URL}/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    log('Playlist songs retrieved', playlistSongsResponse.data);
    
    // Test 11: Add Collaboration
    log('Testing Add Collaboration');
    const collaborationResponse = await axios.post(`${BASE_URL}/collaborations`, {
      playlistId: playlistId,
      userId: userId2
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    log('Collaboration added', collaborationResponse.data);
    
    // Test 12: Get Playlist Activities
    log('Testing Get Playlist Activities');
    const activitiesResponse = await axios.get(`${BASE_URL}/playlists/${playlistId}/activities`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    log('Playlist activities retrieved', activitiesResponse.data);
    
    // Test 13: Refresh Token
    log('Testing Refresh Token');
    const refreshResponse = await axios.put(`${BASE_URL}/authentications`, {
      refreshToken: refreshToken
    });
    const newAccessToken = refreshResponse.data.data.accessToken;
    log('Token refreshed successfully', refreshResponse.data);
    
    // Test 14: Delete Song from Playlist
    log('Testing Delete Song from Playlist');
    const deleteSongResponse = await axios.delete(`${BASE_URL}/playlists/${playlistId}/songs`, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`
      },
      data: {
        songId: songId
      }
    });
    log('Song deleted from playlist', deleteSongResponse.data);
    
    // Test 15: Delete Collaboration
    log('Testing Delete Collaboration');
    const deleteCollabResponse = await axios.delete(`${BASE_URL}/collaborations`, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`
      },
      data: {
        playlistId: playlistId,
        userId: userId2
      }
    });
    log('Collaboration deleted', deleteCollabResponse.data);
    
    // Test 16: Delete Playlist
    log('Testing Delete Playlist');
    const deletePlaylistResponse = await axios.delete(`${BASE_URL}/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${newAccessToken}`
      }
    });
    log('Playlist deleted', deletePlaylistResponse.data);
    
    // Test 17: Logout
    log('Testing User Logout');
    const logoutResponse = await axios.delete(`${BASE_URL}/authentications`, {
      data: {
        refreshToken: refreshToken
      }
    });
    log('User logged out successfully', logoutResponse.data);
    
    console.log('\n🎉 All v2 features tested successfully!');
    console.log('\n📊 Test Summary:');
    console.log('✅ User Registration: PASSED');
    console.log('✅ User Authentication: PASSED');
    console.log('✅ User Details: PASSED');
    console.log('✅ Playlist CRUD: PASSED');
    console.log('✅ Playlist Songs Management: PASSED');
    console.log('✅ Collaborations: PASSED');
    console.log('✅ Playlist Activities: PASSED');
    console.log('✅ Token Refresh: PASSED');
    console.log('✅ JWT Authentication: PASSED');
    console.log('\n🚀 OpenMusic API v2 is ready for submission!');
    
  } catch (error) {
    logError('Test failed', error);
    process.exit(1);
  }
}

// Run tests
testV2Features();