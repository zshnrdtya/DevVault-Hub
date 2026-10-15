# DevVault: Personal Developer Hub

> Simpan sekali, temukan dalam hitungan detik. Pusat manajemen personal untuk code snippets, AI prompts, dan resource bookmarks harian Anda.

Dibuat oleh: **Raditya Rai Zeeshan** ([@zshnrdtya](https://github.com/zshnrdtya))

---

## Ringkasan Proyek

**DevVault** adalah aplikasi *personal knowledge base* dan *second brain* mandiri yang dirancang khusus untuk software developer. Aplikasi ini menyatukan tiga pilar kebutuhan harian programmer ke dalam satu antarmuka yang cepat, terisolasi per pengguna, dan responsif di seluruh perangkat.

Dibangun dengan arsitektur modern **Laravel + Inertia.js (React + TypeScript)**, DevVault memprioritaskan performa tinggi, keamanan data ketat melalui Policy otorisasi, serta desain antarmuka bersih berbasis tipografi **Space Mono**.

---

## Fitur Utama

### 1. Code Snippets Manager
- Simpan potongan kode penting dengan pewarnaan sintaks (*syntax highlighting*).
- Penghitung otomatis frekuensi penyalinan kode (*copy count* dan *last copied timestamp*).
- Filter instan berdasarkan bahasa pemrograman (PHP, JavaScript, TypeScript, Python, SQL, CSS, HTML, Bash, Go, Rust), kategori, dan status favorit.
- Salin kode instan ke papan klip (*clipboard*) dengan satu klik.

### 2. AI Prompt Library
- Simpan dan kelola pustaka instruksi AI (*prompt template*) untuk kebutuhan coding, debugging, refactoring, dan dokumentasi.
- **Dynamic Variable Viewer**: Mendeteksi otomatis placeholder variabel bertanda `{{variabel}}` di dalam isi prompt dan menampilkannya sebagai elemen interaktif.
- Satu-klik salin prompt siap pakai ke ChatGPT, Claude, atau Gemini.

### 3. Resource Bookmarks
- Simpan tautan referensi web, dokumentasi API, dan repositori GitHub penting.
- Deteksi otomatis domain dan hostname sebagai penanda visual kartu.
- Tautan eksternal yang aman (`target="_blank"` dan `rel="noopener noreferrer"`).
- Peringatan ramah jika URL yang sama sudah pernah disimpan sebelumnya.
- Catatan pribadi untuk menyimpan poin penting dan konteks penggunaan tautan.

### 4. Pencarian Global Universal (Command Palette Ctrl + K)
- Akses modal pencarian cepat dari mana saja menggunakan tombol pintasan keyboard `Ctrl + K` (atau `Cmd + K` di macOS).
- Menjalankan pencarian serentak (*concurrent search*) ke seluruh Snippets, Prompts, dan Bookmarks dengan *debounce* 300 ms.
- Navigasi keyboard penuh (panah atas/bawah, `Enter` untuk membuka, `Esc` untuk menutup).

### 5. Manajemen Kategori & Tag Vault
- Pengelompokan taksonomi per modul dengan palet warna penanda visual.
- Penghapusan kategori yang aman: menghapus kategori tidak menghapus item (item otomatis beralih menjadi tanpa kategori).
- **Tag Vault**: Mengelola tag lintas modul dengan fitur pengubahan nama (*rename*) dan penggabungan otomatis (*auto-merge*).

### 6. Personal Dashboard & Mode Gelap
- Ringkasan statistik dinamis untuk total Snippets, Prompts, Bookmarks, dan Kategori.
- Widget daftar item favorit gabungan lintas modul.
- Pengaturan tema visual: Terang (*Light*), Gelap (*Dark*), dan Otomatis (*System Preference*).

---

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| **Backend** | Laravel 13, PHP 8.4 |
| **Frontend** | React 18, TypeScript, Inertia.js |
| **Styling** | Tailwind CSS (dukungan Dark Mode) |
| **Tipografi** | Space Mono (Monospace) |
| **Ikonografi** | Lucide React |
| **Database** | SQLite (Dev/Testing), kompatibel MySQL / PostgreSQL |
| **Testing** | PHPUnit (83 feature tests, 100% lulus) |

---

## Standar Kode & Kualitas (Rules-Raditya CODE)

Proyek ini dikembangkan dengan mematuhi standar ketat Rules-Raditya CODE:
- **Rule of 300**: 100% berkas kode (PHP dan TSX) berada di bawah 300 baris kode untuk keterbacaan optimal.
- **Karakter Bersih**: Bebas karakter tanda strip panjang (*em dash* dan *en dash*).
- **Mobile First & Aksesibilitas**: Ukuran target sentuh minimal 44 x 44 px pada seluruh tombol interaktif dan form input.
- **Isolasi Data Penuh**: 100% endpoint dilindungi oleh Laravel Policy sehingga pengguna tidak dapat mengakses atau memodifikasi data milik pengguna lain.

---

## Panduan Instalasi Lokal

### 1. Prasyarat Sistem
- PHP >= 8.2 (dengan ekstensi SQLite, pdo, mbstring)
- Composer >= 2.x
- Node.js >= 18.x dan npm

### 2. Langkah Instalasi

```bash
# Clone repositori
git clone https://github.com/zshnrdtya/DevVault-Hub.git
cd DevVault-Hub

# Install dependensi backend
composer install

# Install dependensi frontend
npm install

# Siapkan file environment
cp .env.example .env
php artisan key:generate

# Buat database dan jalankan migrasi beserta data demo
php artisan migrate --seed

# Kompilasi aset frontend
npm run build
```

### 3. Menjalankan Server

```bash
# Jalankan server lokal Laravel
php artisan serve
```

Aplikasi dapat diakses melalui peramban di `http://127.0.0.1:8000`.

### 4. Akun Demo Bawaan
- **Email**: `test@example.com`
- **Password**: `password`

---

## Menjalankan Pengujian Otomatis

```bash
# Menjalankan seluruh pengujian PHPUnit
vendor/bin/phpunit

# Menjalankan linter dan formatter kode Pint
vendor/bin/pint --test
```

---

## Pembuat & Pengembang

Aplikasi ini dirancang dan dikembangkan oleh:
- **Pengembang**: Raditya Rai Zeeshan
- **GitHub**: [@zshnrdtya](https://github.com/zshnrdtya)
- **Repositori**: [DevVault-Hub](https://github.com/zshnrdtya/DevVault-Hub)

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE).
