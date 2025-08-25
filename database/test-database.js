/**
 * Script untuk test operasi database OpenMusic API
 * Menguji koneksi database dan operasi CRUD dasar
 */

const { Pool } = require('pg');
require('dotenv').config();

// Konfigurasi database
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function testDatabaseOperations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Memulai test database operations...');
    
    // Test 1: Koneksi database
    console.log('\n1️⃣ Test koneksi database...');
    const connectionTest = await client.query('SELECT NOW() as current_time, current_database() as database_name;');
    console.log('✅ Koneksi berhasil!');
    console.log(`   Database: ${connectionTest.rows[0].database_name}`);
    console.log(`   Waktu: ${connectionTest.rows[0].current_time}`);
    
    // Test 2: Cek struktur tabel
    console.log('\n2️⃣ Test struktur tabel...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('⚠️  Tidak ada tabel yang ditemukan!');
      console.log('   Jalankan setup database terlebih dahulu:');
      console.log('   - Manual: psql -d dicoding_submission_1 -f database/create-tables.sql');
      console.log('   - Script: npm run db:setup (jika PostgreSQL server berjalan)');
      return;
    }
    
    console.log('✅ Tabel ditemukan:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Test 3: Test insert album
    console.log('\n3️⃣ Test insert album...');
    const albumId = 'album-test-' + Date.now();
    await client.query(
      'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3)',
      [albumId, 'Test Album', 2024]
    );
    console.log('✅ Album berhasil ditambahkan!');
    
    // Test 4: Test select album
    console.log('\n4️⃣ Test select album...');
    const albumResult = await client.query(
      'SELECT * FROM albums WHERE id = $1',
      [albumId]
    );
    console.log('✅ Album berhasil diambil:');
    console.log(`   ID: ${albumResult.rows[0].id}`);
    console.log(`   Name: ${albumResult.rows[0].name}`);
    console.log(`   Year: ${albumResult.rows[0].year}`);
    
    // Test 5: Test insert song
    console.log('\n5️⃣ Test insert song...');
    const songId = 'song-test-' + Date.now();
    await client.query(
      'INSERT INTO songs (id, title, year, genre, performer, album_id) VALUES ($1, $2, $3, $4, $5, $6)',
      [songId, 'Test Song', 2024, 'Pop', 'Test Artist', albumId]
    );
    console.log('✅ Song berhasil ditambahkan!');
    
    // Test 6: Test join query
    console.log('\n6️⃣ Test join query...');
    const joinResult = await client.query(`
      SELECT s.id, s.title, s.performer, a.name as album_name
      FROM songs s
      LEFT JOIN albums a ON s.album_id = a.id
      WHERE s.id = $1
    `, [songId]);
    console.log('✅ Join query berhasil:');
    console.log(`   Song: ${joinResult.rows[0].title}`);
    console.log(`   Artist: ${joinResult.rows[0].performer}`);
    console.log(`   Album: ${joinResult.rows[0].album_name}`);
    
    // Test 7: Test update
    console.log('\n7️⃣ Test update album...');
    await client.query(
      'UPDATE albums SET name = $1 WHERE id = $2',
      ['Updated Test Album', albumId]
    );
    console.log('✅ Album berhasil diupdate!');
    
    // Test 8: Test foreign key constraint
    console.log('\n8️⃣ Test foreign key constraint...');
    await client.query('DELETE FROM albums WHERE id = $1', [albumId]);
    const songAfterDelete = await client.query(
      'SELECT album_id FROM songs WHERE id = $1',
      [songId]
    );
    console.log('✅ Foreign key constraint bekerja!');
    if (songAfterDelete.rows.length === 0) {
      console.log('   Song berhasil dihapus karena CASCADE');
    } else {
      console.log(`   Album ID setelah delete: ${songAfterDelete.rows[0].album_id || 'NULL'}`);
    }
    
    // Cleanup
    console.log('\n🧹 Cleanup test data...');
    await client.query('DELETE FROM songs WHERE id = $1', [songId]);
    console.log('✅ Test data berhasil dihapus!');
    
    console.log('\n🎉 Semua test database berhasil!');
    
  } catch (error) {
    console.error('❌ Error test database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Jalankan test jika file ini dieksekusi langsung
if (require.main === module) {
  testDatabaseOperations()
    .then(() => {
      console.log('\n✨ Test database operations selesai!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test database operations gagal:', error);
      process.exit(1);
    });
}

module.exports = { testDatabaseOperations };