# DESIGN.md — DevVault

> **Direction and Identity Specification**  
> antislop is a filter, not a beautifier. This document gives DevVault its soul: identity, personality, palette, typography, and mood.  
> Mode antislop: **DURING** (aktif di setiap tahap pengerjaan).

---

## 1. Identity & Purpose

- **Product Name:** DevVault
- **Tagline & One-Line Value Proposition:** Simpan sekali, temukan dalam hitungan detik. Pusat penyimpanan dan pengelolaan personal untuk code snippet, prompt AI, dan resource bookmark developer.
- **Target Audience:** Junior to mid-level software developers, siswa/mahasiswa PKL, dan solo programmer yang butuh workspace personal cepat dan terorganisir.
- **Brand Personality:** *Utilitarian, Precision-crafted, Focused, Honest*. Tidak bertele-tele, cepat digunakan, minim distraksi visual.

---

## 2. Visual Theme & Surface

- **Theme Mode:** Light & Dark Mode dengan toggle aktif (mengikuti preferensi sistem dan user toggle).
  - *Rationale:* Developer bekerja siang dan malam dalam pencahayaan berbeda. Kode dan prompt harus nyaman dibaca berjam-jam tanpa eyestrain.
- **Visual Motif:** *Tactile Developer Archive* — perpaduan antara terminal presisi dan arsip dokumen rapi. Flat surface dengan pembatas hairline 1px yang tegas. Bebas dari *glowing orbs*, *excessive blur/glassmorphism*, dan gradien kosmetik tak berdasar.
- **Surface Treatment:** Matte flat surfaces, hairline 1px borders (`#E4E4E7` di light / `#27272A` di dark), elevasi berbasis border bukan soft shadow melayang.

---

## 3. Color Palette

> **Antislop Constraint:** Dibatasi ketat pada 2–3 warna inti + 1 aksen fungsional (R-29). Tanpa gradien ungu-biru AI klise (R-01).

- **Background (Canvas):** `#FAFAFA` (Light) / `#0C0D0E` (Dark)
- **Surface / Card:** `#FFFFFF` (Light) / `#141619` (Dark)
- **Primary Text:** `#18181B` (Light) / `#F4F4F5` (Dark) *(WCAG AA rasio kontras > 12:1)*
- **Muted Text:** `#52525B` (Light) / `#A1A1AA` (Dark) *(WCAG AA rasio kontras > 4.5:1)*
- **Border / Divider:** `#E4E4E7` (Light) / `#27272A` (Dark)
- **Deliberate Accent:** `#0284C7` (Sky 600 - functional engineer blue)
  - *Accent Function:* Khusus tombol CTA utama (misal: "Simpan Snippet"), indikator aktif/fokus, dan badge status penting. Maksimal 1–2 elemen per layar.

---

## 4. Typography Hierarchy

Sesuai ketentuan **PRD Bagian 12.2**:
- **Interface Font (Heading & Body):** `Space Grotesk`, ui-sans-serif, system-ui, sans-serif (Fontsource)
- **Code & Monospace Font:** `Space Mono`, ui-monospace, SFMono-Regular, Menlo, monospace (Fontsource)
- **Aturan Tipografi:**
  - `Space Grotesk` untuk semua judul, navigasi, form label, dan tombol (weight: 400, 500, 600, 700). Tidak memakai italic sintetis (gunakan weight 500/600 untuk penekanan).
  - `Space Mono` untuk seluruh code blocks, badge bahasa pemrograman, placeholder variabel `{{...}}`, statistik numerik, dan URL.
- **Type Scale:**
  - H1 / Page Header: `clamp(1.5rem, 3vw, 2rem)` (font-weight: 600, tracking: tight)
  - Card Title / H2: `1.125rem` (18px, font-weight: 600)
  - Body Text: `0.9375rem` (15px) dengan `line-height: 1.6`
  - Code Block Text: `0.8125rem` (13px) hingga `0.875rem` (14px) `Space Mono`
  - Small / Meta / Badge: `0.75rem` (12px)

---

## 5. Antislop Dials (R-37)

- **ENERGY:** `2` (Confident, balanced contrast, data hierarchy yang jelas tanpa ornamen bising).
- **RHYTHM:** `2` (Variasi terstruktur antara Snippet, Prompt, dan Resource; kartu fungsional dengan informasi terpadat diutamakan).
- **MOTION:** `2` (Transisi mikro 150ms yang fungsional, umpan balik instan pada aksi copy to clipboard dan toggle favorit).

---

## 6. Layout & Sizing Rules (Mobile-First)

- **Container Max-Width:** `1280px` (`max-w-7xl`) untuk area dashboard dan list.
- **Border Radii:**
  - Tombol, input, dropdown: `6px` (`rounded-md` yang presisi, bukan pill raksasa).
  - Kartu modul & modal: `8px` (`rounded-lg`).
- **Touch Target (Mobile):** Minimal `44 x 44 px` untuk semua tombol interaktif (Copy, Favorit, Menu hamburger, Filter).
- **Zero Horizontal Scroll:** Tidak ada elemen yang bocor keluar layar pada lebar 360px ke atas (`overflow-x: auto` hanya pada wadah kode).

---

## 7. Voice & Copywriting Directives

- **Tone:** Ringkas, presisi, ramah developer, to-the-point.
- **Bahasa Utama UI:** Bahasa Indonesia yang natural (atau dwibahasa terstruktur).
- **Dilarang Keras:** Istilah klise AI (*unlock, elevate, empower, seamless, game-changer, delve, revolutionizing*).
- **Umpan Balik Tindakan:** Singkat dan jelas (contoh: "Tersalin ke clipboard!", "Snippet berhasil disimpan").

---

## 8. Iconography & Visual Symbols

- **Library Ikon:** Wajib menggunakan **Lucide React** (`lucide-react`).
- **Aturan Penggunaan Ikon:**
  - Tidak menggunakan emoji mentah (seperti 🚀, 💡, ✅, 🔥) di antarmuka atau komentar kode yang terbawa ke UI.
  - Ikon bersifat utilitarian dan semantik: `Copy`, `Check`, `Bookmark`, `Code`, `Terminal`, `Star`, `Search`, `Plus`, `Folder`, `Tag`, dll.
  - Ukuran standar ikon UI: `16px` (h-4 w-4) untuk tombol ringkas/badge, `18–20px` (h-5 w-5) untuk navigasi dan tombol utama.
  - Stroke width: default 1.75–2px agar tajam dan terbaca jelas di layar retina/mobile.

