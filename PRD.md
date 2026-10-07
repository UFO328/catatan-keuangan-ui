# PRD --- Catatan Keuangan Web UI

**Versi:** 1.0\
**Status:** Draft siap implementasi\
**Target:** Web responsive --- HTML, CSS, JavaScript, Bootstrap 5\
**API Source of Truth:** `Catatan Keuangan API` OpenAPI 3.0.3\
**API Version:** 1.0.0

------------------------------------------------------------------------

## 1. Product Overview

Catatan Keuangan adalah aplikasi web sederhana untuk membantu pengguna
mencatat:

-   pemasukan;
-   pengeluaran;
-   kategori transaksi;
-   tanggal transaksi;
-   deskripsi transaksi;
-   ringkasan keuangan berdasarkan kategori.

UI harus terasa seperti produk yang benar-benar dirancang, bukan
kumpulan komponen Bootstrap yang ditempelkan.

### Prinsip utama

1.  **Clarity over decoration** --- informasi keuangan harus mudah
    dibaca.
2.  **Consistency** --- spacing, typography, button, form, modal, table,
    dan feedback menggunakan sistem visual yang sama.
3.  **Responsive by default** --- desktop, tablet, dan mobile bukan tiga
    desain berbeda.
4.  **Low visual noise** --- hindari gradient berlebihan, glassmorphism,
    terlalu banyak shadow, icon dekoratif, dan kartu yang tidak memiliki
    fungsi.
5.  **Data first** --- angka dan transaksi adalah fokus utama.
6.  **Progressive disclosure** --- detail hanya ditampilkan ketika
    diperlukan.
7.  **Real API only** --- jangan membuat dummy data permanen di UI.
8.  **Accessible interaction** --- keyboard, focus state, label form,
    error state, dan kontras harus diperhatikan.
9.  **Chart di dashboard**-- aku mau kamu membuat chart di dashboard

------------------------------------------------------------------------

# 2. API Contract

## Production

 `https://catatan-keuangan-zeta-sand.vercel.app/`

## Local

`http://127.0.0.1:8000`

Frontend harus mempunyai satu konfigurasi base URL agar perpindahan
local/production tidak membutuhkan perubahan pada setiap file.

Contoh konsep:

``` js
const API_BASE_URL = "http://127.0.0.1:8000";
```

Production dapat diganti melalui satu konfigurasi terpusat.

------------------------------------------------------------------------

# 3. Authentication

API menggunakan JWT Bearer Authentication.

## Login

`POST /auth/catatan_keuangan/api/login/`

Request:

``` json
{
  "username": "riski",
  "password": "passwordku123"
}
```

Response sukses:

``` json
{
  "access": "...",
  "refresh": "...",
  "username": "riski",
  "id": 1
}
```

Access token aktif selama 15 menit. Refresh token aktif selama 7 hari.

## Register

`POST /auth/catatan_keuangan/api/register/`

Request:

``` json
{
  "username": "riski",
  "email": "riski@example.com",
  "password": "passwordku123"
}
```

Response:

``` json
{
  "message": "Account Berhasil Dibuat"
}
```

## Logout

`POST /auth/catatan_keuangan/api/logout/`

Request:

``` json
{
  "refresh": "<refresh-token>"
}
```

Logout melakukan blacklist terhadap refresh token.

## Frontend authentication requirements

-   Simpan access dan refresh token secara konsisten.
-   Jangan menaruh token di banyak tempat.
-   Semua endpoint protected menggunakan:

``` http
Authorization: Bearer <access-token>
```

-   Jika access token expired, frontend harus mencoba mekanisme refresh
    token.
-   Jika refresh token tidak valid/expired, pengguna diarahkan kembali
    ke login.
-   Logout harus memanggil endpoint logout sebelum membersihkan session
    lokal jika memungkinkan.
-   Jangan menampilkan token kepada pengguna.
-   Jangan memasukkan token ke URL, query parameter, atau log UI.

------------------------------------------------------------------------

# 4. Information Architecture

Struktur halaman utama:

``` text
/auth
  ├── login
  └── register

/app
  ├── dashboard
  ├── transactions
  └── categories
```

Navigasi utama:

``` text
Dashboard
Transaksi
Kategori
Logout
```

Tidak perlu menambahkan menu seperti:

-   Budget
-   Laporan PDF
-   Rekening bank
-   Investasi
-   Notifikasi
-   Profile
-   Settings

kecuali API/backend nantinya memang menyediakan fitur tersebut.

------------------------------------------------------------------------

# 5. Visual Direction

## Design personality

Produk harus terlihat:

-   tenang;
-   modern;
-   fungsional;
-   profesional;
-   ringan;
-   mudah dipindai.

Bukan:

-   dashboard template generik;
-   landing page SaaS;
-   cyberpunk;
-   glassmorphism;
-   gradient-heavy;
-   penuh kartu;
-   penuh ikon;
-   penuh animasi.

## Color system

Gunakan palet kecil dan konsisten.

Contoh semantic roles:

``` text
--color-primary
--color-primary-hover
--color-success
--color-danger
--color-warning
--color-background
--color-surface
--color-border
--color-text
--color-text-muted
```

Warna hijau dan merah digunakan untuk konteks finansial:

-   INCOME → semantic success;
-   EXPENSE → semantic danger.

Jangan menggunakan warna hanya sebagai dekorasi.

## Typography

Gunakan satu font utama dengan hierarchy yang jelas:

``` text
Page title
Section title
Body
Secondary text
Caption
```

Hindari terlalu banyak ukuran font.

## Spacing

Gunakan spacing Bootstrap secara konsisten:

``` text
4px / 8px / 12px / 16px / 24px / 32px / 48px
```

Jangan membuat setiap komponen memiliki margin random.

------------------------------------------------------------------------

# 6. Anti AI-Slop Rules

UI harus secara eksplisit menghindari pola visual generik yang sering
muncul pada hasil AI.

## Dilarang sebagai default

-   gradient background besar;
-   hero section yang tidak dibutuhkan;
-   glassmorphism;
-   blur berlebihan;
-   card di dalam card di dalam card;
-   rounded corner ekstrem pada semua elemen;
-   shadow besar pada setiap komponen;
-   icon sebelum setiap label;
-   emoji sebagai icon UI;
-   angka besar tanpa konteks;
-   chart hanya untuk membuat dashboard terlihat ramai;
-   animasi pada setiap hover;
-   navbar dengan terlalu banyak item;
-   teks marketing yang tidak berhubungan dengan aplikasi.

## Aturan desain

Setiap komponen harus menjawab:

> "Informasi atau tindakan apa yang dibantu oleh komponen ini?"

Jika tidak ada jawaban yang jelas, komponen tidak perlu dibuat.

------------------------------------------------------------------------

# 7. Responsive Strategy

Gunakan Bootstrap 5 grid dan utility sebagai fondasi.

## Desktop

Target:

`>= 992px`

Layout:

``` text
┌──────────────┬─────────────────────────────┐
│ Sidebar      │ Main content                │
│              │                             │
│ Dashboard    │ Page content                │
│ Transaksi    │                             │
│ Kategori     │                             │
│ Logout       │                             │
└──────────────┴─────────────────────────────┘
```

## Tablet

Target:

`768px - 991px`

Sidebar dapat diperkecil atau berubah menjadi offcanvas.

## Mobile

Target:

`< 768px`

Gunakan:

-   offcanvas navigation;
-   single-column layout;
-   full-width primary action;
-   form satu kolom;
-   table yang dapat di-scroll horizontal atau berubah menjadi list/card
    yang tetap informatif;
-   modal yang nyaman digunakan pada layar kecil.

Jangan mengecilkan seluruh desktop layout sampai menjadi mobile.

------------------------------------------------------------------------

# 8. Global Layout

## Desktop

``` text
App shell
├── Sidebar
└── Main
    ├── Topbar
    └── Page content
```

## Mobile

``` text
Topbar
├── Menu button
├── Page title
└── User context

Page content

Offcanvas navigation
```

Sidebar tidak boleh mengambil terlalu banyak ruang.

------------------------------------------------------------------------

# 9. Login Page

## Goal

Memungkinkan pengguna masuk menggunakan username dan password.

## Components

-   application name;
-   username input;
-   password input;
-   submit button;
-   loading state;
-   error message;
-   link menuju register.

## UX

Saat submit:

``` text
Idle
→ Loading
→ Success → Dashboard
→ Error → Show error
```

Button tidak boleh dapat diklik berkali-kali selama request berlangsung.

## Error states

Handle minimal:

-   username/password salah;
-   server error;
-   network error;
-   validation error.

Jangan hanya menampilkan:

> Something went wrong.

Tampilkan pesan yang dapat dipahami pengguna.

------------------------------------------------------------------------

# 10. Register Page

Fields:

-   username;
-   email;
-   password.

Validasi client-side hanya membantu UX. Validasi backend tetap menjadi
sumber kebenaran.

Success:

``` text
Register success
→ show confirmation
→ navigate to login
```

Jangan menganggap user otomatis login karena response API hanya
mengembalikan message.

------------------------------------------------------------------------

# 11. Dashboard

Endpoint:

`GET /dashboard/catatan_keuangan/api/dashboard/`

Response menyediakan:

``` json
{
  "total_income": "10000000.00",
  "total_expense": "2500000.00",
  "total_expense_by_category": [],
  "total_income_by_category": []
}
```

## Dashboard hierarchy

Urutan informasi:

1.  Ringkasan pemasukan;
2.  Ringkasan pengeluaran;
3.  rincian pemasukan berdasarkan kategori;
4.  rincian pengeluaran berdasarkan kategori.

## Summary

Gunakan dua summary block utama:

``` text
Total Pemasukan
Rp10.000.000

Total Pengeluaran
Rp2.500.000
```

Jangan menambahkan "Saldo" jika backend belum menyediakan perhitungan
saldo sebagai field API. Jika ingin menghitung saldo di frontend:

``` text
balance = total_income - total_expense
```

perhitungan tersebut harus dianggap sebagai derived value, bukan data
langsung dari API.

## Category breakdown

Gunakan visualisasi hanya jika membantu.

Pilihan utama:

-   horizontal bar;
-   simple table;
-   donut chart jika jumlah kategori dan data memang cocok.

Jangan menampilkan chart kosong hanya demi memenuhi dashboard.

## Empty state

Jika belum ada transaksi:

``` text
Belum ada transaksi

Tambahkan pemasukan atau pengeluaran pertama Anda untuk mulai melihat ringkasan keuangan.
```

Primary action:

`Tambah Transaksi`

------------------------------------------------------------------------

# 12. Transaction Page

Endpoint:

`GET /transaction/catatan_keuangan/api/transaction/`

Pagination:

10 data per halaman.

## Available filters

### Category

Query:

``` text
?category=<id>
```

### Date from

``` text
?date_from=YYYY-MM-DD
```

### Date to

``` text
?date_to=YYYY-MM-DD
```

### Type

``` text
?type=INCOME
```

atau:

``` text
?type=EXPENSE
```

### Pagination

``` text
?page=2
```

Filter dapat dikombinasikan.

Contoh:

``` text
/transaction/catatan_keuangan/api/transaction/?type=EXPENSE&category=2&date_from=2026-10-01&date_to=2026-10-31&page=1
```

## Transaction list

Desktop dapat menggunakan table:

  Tanggal   Kategori   Deskripsi   Tipe     Nominal Action
  --------- ---------- ----------- ------ --------- --------

Mobile harus tetap mudah dibaca.

Jika table menjadi terlalu lebar, gunakan horizontal scroll sebagai
fallback, bukan mengecilkan font sampai sulit dibaca.

## Transaction type

INCOME:

``` text
+ Rp50.000
```

EXPENSE:

``` text
- Rp15.000
```

Gunakan semantic styling, tetapi jangan hanya mengandalkan warna. Tipe
juga harus ditulis secara eksplisit.

------------------------------------------------------------------------

# 13. Create Transaction

Endpoint:

`POST /transaction/catatan_keuangan/api/transaction/`

Fields:

``` text
category
type
amount
description
transaction_date
```

## Form

Urutan:

1.  Type
2.  Amount
3.  Category
4.  Transaction date
5.  Description

Type:

``` text
INCOME
EXPENSE
```

Category harus berasal dari endpoint kategori.

Amount:

-   angka positif;
-   minimal lebih dari 0;
-   tampilkan format rupiah pada UI;
-   kirim format decimal yang sesuai API.

Transaction date:

Gunakan date/time picker native atau komponen ringan. Jangan membuat
date picker custom jika tidak diperlukan.

------------------------------------------------------------------------

# 14. Edit Transaction

Endpoint:

`PATCH /transaction/catatan_keuangan/api/transaction/{id}/`

Gunakan PATCH untuk perubahan sebagian data.

UI:

``` text
Edit transaction
→ load current data
→ modify
→ submit
→ update list
```

Jangan melakukan full reload halaman jika update lokal dapat dilakukan
dengan aman.

------------------------------------------------------------------------

# 15. Delete Transaction

Endpoint:

`DELETE /transaction/catatan_keuangan/api/transaction/{id}/`

Delete adalah destructive action.

UX:

``` text
Click delete
→ confirmation
→ delete request
→ success feedback
→ remove item from UI
```

Confirmation harus menjelaskan transaksi yang akan dihapus.

Jangan membuat delete langsung terjadi hanya karena tombol ditekan.

------------------------------------------------------------------------

# 16. Category Page

Endpoint:

`GET /transaction/catatan_keuangan/api/category/`

Category CRUD:

``` text
GET
POST
PUT
PATCH
DELETE
```

## Category list

Tampilkan:

-   nama kategori;
-   status default;
-   action edit;
-   action delete.

Field `user`, `created_at`, dan `updated_at` tidak perlu ditampilkan
pada UI utama karena bersifat metadata internal.

## Create category

Request:

``` json
{
  "name": "Hadiah",
  "is_default": false
}
```

## Category uniqueness

Nama kategori unik untuk user.

Jika API mengembalikan duplicate error, tampilkan error pada form:

``` text
Kategori dengan nama tersebut sudah ada.
```

## Delete restriction

Kategori yang sudah digunakan transaksi tidak dapat dihapus.

Jika API mengembalikan `400`, jangan tampilkan error generik. Jelaskan:

``` text
Kategori tidak dapat dihapus karena masih digunakan oleh transaksi.
```

------------------------------------------------------------------------

# 17. Pagination

Category dan transaction list menggunakan response:

``` json
{
  "count": 123,
  "next": "...",
  "previous": "...",
  "results": []
}
```

Frontend harus menggunakan:

-   `count`;
-   `next`;
-   `previous`;
-   `results`.

Jangan menghitung jumlah halaman dari data yang sedang tampil jika
`count` sudah tersedia.

## Pagination UX

``` text
Previous
1
2
3
Next
```

Pada mobile, sederhanakan:

``` text
Previous     Page 2     Next
```

------------------------------------------------------------------------

# 18. Loading State

Setiap API request harus memiliki feedback.

Contoh:

``` text
Loading dashboard...
Loading transactions...
Saving...
Deleting...
```

Hindari spinner global untuk seluruh aplikasi jika hanya satu bagian
yang sedang loading.

Gunakan local loading state pada komponen yang melakukan request.

------------------------------------------------------------------------

# 19. Error Handling

Standar error UI:

### Validation error

Tampilkan dekat field terkait.

### Authentication error

Jika `401`:

``` text
Session Anda telah berakhir. Silakan login kembali.
```

### Permission/forbidden

Jika `403`:

``` text
Anda tidak memiliki akses untuk melakukan tindakan ini.
```

### Not found

Jika `404`:

``` text
Data tidak ditemukan.
```

### Server error

Jika `5xx`:

``` text
Server sedang mengalami masalah. Coba lagi beberapa saat.
```

### Network error

``` text
Tidak dapat terhubung ke server.
Periksa koneksi internet Anda lalu coba lagi.
```

------------------------------------------------------------------------

# 20. Toast / Feedback System

Gunakan satu sistem feedback global.

Kategori:

``` text
success
error
warning
info
```

Contoh:

``` text
Transaksi berhasil ditambahkan.
Kategori berhasil diperbarui.
Transaksi berhasil dihapus.
```

Jangan menggunakan alert browser sebagai mekanisme utama.

------------------------------------------------------------------------

# 21. Currency Formatting

API menggunakan decimal string.

Frontend menampilkan format Rupiah:

``` text
Rp10.000
Rp250.000
Rp1.500.000
```

Buat satu utility:

``` js
formatCurrency(value)
```

Jangan melakukan formatting manual di setiap component.

Data API tetap disimpan sebagai nilai yang aman untuk operasi numerik.
Formatting hanya dilakukan pada presentation layer.

------------------------------------------------------------------------

# 22. Date Formatting

API menggunakan ISO 8601 date-time.

Frontend harus memiliki utility terpusat:

``` js
formatDate()
formatDateTime()
```

Contoh tampilan:

``` text
5 Oktober 2026
5 Okt 2026, 13:30
```

Timezone harus diperhatikan ketika mengubah ISO timestamp menjadi waktu
lokal.

------------------------------------------------------------------------

# 23. JavaScript Architecture

Jangan membuat satu `app.js` berisi seluruh aplikasi.

Struktur yang direkomendasikan:

``` text
frontend/
├── index.html
├── pages/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── transactions.html
│   └── categories.html
│
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── responsive.css
│
├── js/
│   ├── config.js
│   ├── api/
│   │   ├── client.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── transactions.js
│   │   └── categories.js
│   │
│   ├── components/
│   │   ├── toast.js
│   │   ├── modal.js
│   │   ├── pagination.js
│   │   └── navbar.js
│   │
│   ├── utils/
│   │   ├── currency.js
│   │   ├── date.js
│   │   ├── validation.js
│   │   └── storage.js
│   │
│   └── pages/
│       ├── login.js
│       ├── register.js
│       ├── dashboard.js
│       ├── transactions.js
│       └── categories.js
│
└── assets/
    └── icons/
```

Tujuannya adalah memisahkan:

``` text
API logic
UI logic
Business/display utilities
Page initialization
```

------------------------------------------------------------------------

# 24. API Client

Semua request harus melewati satu API client.

Konsep:

``` js
api.get()
api.post()
api.patch()
api.delete()
```

API client bertanggung jawab terhadap:

-   base URL;
-   Authorization header;
-   JSON serialization;
-   response parsing;
-   error normalization;
-   token refresh;
-   retry satu kali setelah refresh jika access token expired.

Page tidak boleh mengulang kode fetch yang sama berkali-kali.

------------------------------------------------------------------------

# 25. Component Reuse

Komponen yang harus reusable:

-   navbar/topbar;
-   sidebar/offcanvas;
-   button;
-   form field;
-   modal;
-   toast;
-   pagination;
-   loading state;
-   empty state;
-   error state;
-   transaction row/card.

Tujuan:

``` text
Satu aturan visual
→ banyak penggunaan
```

Bukan:

``` text
Setiap halaman
→ desain sendiri
```

------------------------------------------------------------------------

# 26. Bootstrap Usage

Gunakan Bootstrap untuk:

-   grid;
-   responsive utilities;
-   modal;
-   offcanvas;
-   dropdown;
-   form;
-   button;
-   spacing;
-   table;
-   pagination.

Custom CSS digunakan untuk:

-   design tokens;
-   visual identity;
-   layout detail;
-   component refinement;
-   state;
-   responsive adjustment yang memang tidak tersedia di Bootstrap.

Jangan override Bootstrap secara besar-besaran tanpa alasan.

------------------------------------------------------------------------

# 27. Accessibility

Minimum requirement:

-   setiap input mempunyai `<label>`;
-   button memiliki nama yang jelas;
-   focus state terlihat;
-   keyboard navigation berfungsi;
-   modal dapat ditutup dengan keyboard;
-   jangan gunakan warna sebagai satu-satunya penanda status;
-   icon-only button harus memiliki accessible label;
-   heading hierarchy benar;
-   error message terhubung dengan field terkait.

------------------------------------------------------------------------

# 28. Security UX

Frontend tidak boleh:

-   menampilkan password;
-   menyimpan password;
-   menaruh JWT di URL;
-   menampilkan JWT pada console production;
-   menganggap hidden UI sebagai authorization.

Authorization tetap dilakukan backend.

Frontend hanya mengatur pengalaman pengguna berdasarkan status
authentication.

------------------------------------------------------------------------

# 29. Data Flow

## Login

``` text
Login Form
   ↓
POST /auth/.../login/
   ↓
Receive access + refresh
   ↓
Store authentication