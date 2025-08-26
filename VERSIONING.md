# Strategi Versioning - OpenMusic API

## Overview
Proyek OpenMusic API menggunakan strategi versioning berbasis branch untuk mengelola berbagai versi API. Setiap versi mayor memiliki branch tersendiri yang memungkinkan pengembangan paralel dan maintenance yang mudah.

## Struktur Branch

### Branch Utama
- **`main`**: Branch utama yang berisi kode terstabil dan terbaru
- Semua development dimulai dari branch ini
- Hanya menerima merge dari branch versi yang sudah stabil

### Branch Versi
- **`v1`**: OpenMusic API versi 1.0 (Submission 1 - Dicoding)
  - Fitur: CRUD Albums & Songs, PostgreSQL, Hapi.js
  - Status: Stable ✅

- **`v2`** (Future): OpenMusic API versi 2.0
  - Planned features: Authentication, Authorization, File Upload
  - Status: Planned 📋

- **`v3`** (Future): OpenMusic API versi 3.0
  - Planned features: Playlist Management, Collaboration
  - Status: Planned 📋

## Workflow Pengembangan

### Untuk Versi Baru (v2, v3, dst)
1. **Mulai dari main branch**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Buat branch versi baru**:
   ```bash
   git checkout -b v2
   ```

3. **Develop fitur-fitur baru**:
   ```bash
   # Lakukan development
   git add .
   git commit -m "feat: implement new features for v2"
   ```

4. **Push ke GitHub**:
   ```bash
   git push -u origin v2
   ```

### Untuk Maintenance/Bugfix
1. **Checkout ke branch versi yang perlu diperbaiki**:
   ```bash
   git checkout v1
   ```

2. **Buat branch feature/bugfix**:
   ```bash
   git checkout -b hotfix/v1-bug-description
   ```

3. **Setelah selesai, merge kembali ke branch versi**:
   ```bash
   git checkout v1
   git merge hotfix/v1-bug-description
   git push origin v1
   ```

## Best Practices

### 1. Naming Convention
- Branch versi: `v1`, `v2`, `v3`, dst
- Feature branch: `feature/v2-authentication`
- Bugfix branch: `hotfix/v1-database-connection`
- Release branch: `release/v2.1.0`

### 2. Commit Messages
- `feat:` untuk fitur baru
- `fix:` untuk perbaikan bug
- `docs:` untuk perubahan dokumentasi
- `refactor:` untuk refactoring kode
- `test:` untuk penambahan/perubahan test

### 3. Merge Strategy
- Gunakan **merge commit** untuk menggabungkan branch versi ke main
- Gunakan **squash merge** untuk feature branch kecil
- Selalu buat **Pull Request** untuk review kode

## Keamanan Branch

### Branch Protection Rules (Recommended)
1. **Main Branch**:
   - Require pull request reviews
   - Require status checks to pass
   - Restrict pushes to main branch

2. **Version Branches (v1, v2, dst)**:
   - Require pull request reviews untuk perubahan major
   - Allow direct push untuk hotfix minor

## Deployment Strategy

### Production
- **v1**: Deployed to production (stable)
- **main**: Staging environment (latest stable)

### Development
- **v2, v3**: Development environment
- **feature branches**: Local development

## Contoh Skenario

### Skenario 1: Mengembangkan V2
```bash
# 1. Mulai dari main
git checkout main
git pull origin main

# 2. Buat branch v2
git checkout -b v2

# 3. Develop fitur authentication
# ... coding ...

# 4. Commit dan push
git add .
git commit -m "feat: add user authentication system"
git push -u origin v2
```

### Skenario 2: Hotfix untuk V1
```bash
# 1. Checkout ke v1
git checkout v1
git pull origin v1

# 2. Buat hotfix branch
git checkout -b hotfix/v1-database-timeout

# 3. Fix bug
# ... coding ...

# 4. Merge kembali ke v1
git checkout v1
git merge hotfix/v1-database-timeout
git push origin v1

# 5. Cleanup
git branch -d hotfix/v1-database-timeout
```

## Monitoring & Maintenance

- **v1**: Active maintenance (bug fixes only)
- **v2**: Active development
- **main**: Always reflects latest stable version

---

**Dibuat pada**: 25-08-2025
**Versi Dokumen**: 1.0
**Maintainer**: Development Team