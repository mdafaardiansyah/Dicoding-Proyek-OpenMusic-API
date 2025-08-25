/**
 * Script untuk setup database OpenMusic API
 * Menjalankan SQL script untuk membuat tabel dan struktur database
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

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Memulai setup database...');
    
    // Membaca file SQL
    const sqlPath = path.join(__dirname, 'create-tables.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');
    
    // Menjalankan script SQL
    await client.query(sqlScript);
    
    console.log('✅ Database berhasil di-setup!');
    console.log('📋 Tabel yang dibuat:');
    console.log('   - albums (dengan index pada name dan year)');
    console.log('   - songs (dengan foreign key ke albums)');
    console.log('   - Trigger auto-update timestamp');
    
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
    console.error('❌ Error setup database:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Jalankan setup jika file ini dieksekusi langsung
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('\n🎉 Setup database selesai!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup database gagal:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };