const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    const form = new FormData();
    form.append('cover', fs.createReadStream('test-cover.txt'), {
      filename: 'test-cover.jpg',
      contentType: 'image/jpeg'
    });

    const response = await fetch('http://localhost:5000/albums/album-SGN43yvCrQho5eoc/covers', {
      method: 'POST',
      body: form
    });

    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testUpload();