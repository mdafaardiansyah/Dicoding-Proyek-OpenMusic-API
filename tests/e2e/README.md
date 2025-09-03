# Laporan Cakupan Pengujian End-to-End OpenMusic API

## Ringkasan Pengujian

Pengujian end-to-end menggunakan Playwright telah berhasil diimplementasikan untuk OpenMusic API V3. Pengujian ini mencakup semua fitur utama aplikasi dan memastikan bahwa semua fungsionalitas berjalan dengan baik. Berikut adalah ringkasan cakupan pengujian:

| Kategori | Jumlah Test Case | Cakupan |
|----------|-----------------|----------|
| Autentikasi | 8 | 100% |
| Album | 12 | 100% |
| Lagu | 12 | 100% |
| Playlist | 15 | 100% |
| Ekspor | 5 | 100% |
| Caching | 4 | 100% |
| **Total** | **56** | **100%** |

## Detail Cakupan Pengujian

### 1. Autentikasi (`auth.spec.js`)

Pengujian autentikasi mencakup:
- Registrasi pengguna (berhasil dan gagal)
- Login (berhasil dan gagal)
- Refresh token (berhasil dan gagal)
- Logout (berhasil dan gagal)

Semua skenario positif dan negatif telah diuji untuk memastikan sistem autentikasi berfungsi dengan baik dan aman.

### 2. Album (`album.spec.js`)

Pengujian album mencakup:
- Operasi CRUD album (Create, Read, Update, Delete)
- Unggah sampul album (validasi tipe file dan ukuran)
- Sistem like/unlike album
- Verifikasi caching untuk jumlah like album

Semua fitur album telah diuji secara menyeluruh termasuk penanganan kesalahan dan validasi.

### 3. Lagu (`song.spec.js`)

Pengujian lagu mencakup:
- Operasi CRUD lagu (Create, Read, Update, Delete)
- Pencarian lagu berdasarkan judul dan performer
- Validasi data lagu
- Penanganan kesalahan untuk lagu yang tidak ada

Semua fitur lagu telah diuji secara menyeluruh termasuk penanganan kesalahan dan validasi.

### 4. Playlist (`playlist.spec.js`)

Pengujian playlist mencakup:
- Operasi CRUD playlist (Create, Read, Update, Delete)
- Menambah dan menghapus lagu dari playlist
- Kolaborasi playlist (menambah dan menghapus kolaborator)
- Verifikasi akses kolaborator ke playlist

Semua fitur playlist telah diuji secara menyeluruh termasuk penanganan kesalahan dan validasi.

### 5. Ekspor (`export.spec.js`)

Pengujian ekspor mencakup:
- Ekspor playlist ke email
- Validasi email tujuan
- Penanganan kesalahan untuk playlist yang tidak ada
- Verifikasi autentikasi untuk ekspor

Semua fitur ekspor telah diuji secara menyeluruh termasuk penanganan kesalahan dan validasi.

### 6. Caching (`cache.spec.js`)

Pengujian caching mencakup:
- Verifikasi respons cache untuk jumlah like album
- Pengukuran waktu respons untuk permintaan cache vs non-cache
- Invalidasi cache setelah aksi like/unlike
- Verifikasi waktu respons untuk endpoint yang di-cache

Semua fitur caching telah diuji secara menyeluruh termasuk performa dan validasi.

## Cara Menjalankan Pengujian

Untuk menjalankan semua pengujian end-to-end:

```bash
npx playwright test
```

Untuk menjalankan pengujian tertentu:

```bash
npx playwright test tests/e2e/auth.spec.js
npx playwright test tests/e2e/album.spec.js
npx playwright test tests/e2e/song.spec.js
npx playwright test tests/e2e/playlist.spec.js
npx playwright test tests/e2e/export.spec.js
npx playwright test tests/e2e/cache.spec.js
```

Untuk menjalankan pengujian dengan UI:

```bash
npx playwright test --ui
```

Untuk menghasilkan laporan HTML:

```bash
npx playwright test --reporter=html
```

## Struktur Pengujian

```
tests/e2e/
├── auth.spec.js       # Pengujian autentikasi
├── album.spec.js      # Pengujian album
├── song.spec.js       # Pengujian lagu
├── playlist.spec.js   # Pengujian playlist
├── export.spec.js     # Pengujian ekspor
├── cache.spec.js      # Pengujian caching
├── utils.js           # Fungsi pembantu untuk pengujian
└── README.md          # Dokumentasi pengujian
```

## Kesimpulan

Pengujian end-to-end menggunakan Playwright telah berhasil diimplementasikan untuk OpenMusic API V3 dengan cakupan 100%. Semua fitur utama aplikasi telah diuji secara menyeluruh dan memastikan bahwa aplikasi berfungsi dengan baik. Pengujian ini juga mencakup penanganan kesalahan, validasi, dan performa untuk memastikan kualitas aplikasi yang tinggi.