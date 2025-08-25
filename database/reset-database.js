/**
 * Script untuk reset database OpenMusic API
 * Menghapus semua tabel dan data, kemudian membuat ulang struktur database
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Konfigurasi database
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

async function resetDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Memulai reset database...');
    
    // Drop semua tabel jika ada
    console.log('🗑️  Menghapus tabel yang ada...');
    await client.query('DROP TABLE IF EXISTS songs CASCADE;');
    await client.query('DROP TABLE IF EXISTS albums CASCADE;');
    await client.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;');
    
    console.log('✅ Tabel berhasil dihapus!');
    
    // Membaca dan menjalankan script create tables
    console.log('🔄 Membuat ulang struktur database...');
    const sqlPath = path.join(__dirname, 'create-tables.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    await client.query(sqlScript);
    
    console.log('✅ Database berhasil di-reset!');
    console.log('📋 Struktur database yang dibuat:');
    console.log('   - albums (dengan index dan trigger)');
    console.log('   - songs (dengan foreign key dan trigger)');
    
    // Verifikasi tabel yang dibuat
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tabel yang tersedia:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error reset database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Jalankan reset jika file ini dieksekusi langsung
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('\n🎉 Reset database selesai!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Reset database gagal:', error);
      process.exit(1);
    });
}

module.exports = { resetDatabase };