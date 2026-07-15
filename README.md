# UASPRak — Product Catalog App

Aplikasi mobile UAS Praktikum Pemrograman Mobile, dibangun dengan **React Native + Expo (TypeScript)**. Menampilkan katalog produk dari [DummyJSON](https://dummyjson.com) dengan autentikasi, pencarian, filter kategori, wishlist, dan navigasi bottom tab.
## Tech Stack

- **Expo** (managed workflow, SDK 54) + **TypeScript**
- **React Navigation** (native-stack + bottom-tabs)
- **Fetch API** untuk networking (tanpa Axios)
- **React Context API** untuk state global (tanpa Redux/Zustand)
- **AsyncStorage** untuk penyimpanan kredensial akun lokal secara terenkripsi/hashed (lihat "Catatan Penting" di bawah)
- **Expo Image** (`expo-image`) untuk optimasi performa loading dan caching gambar produk secara asinkron
- **ESLint** (`eslint-config-expo`) + **Prettier**

Tidak ada library UI kit pihak ketiga (NativeBase, RN Paper, dll) — seluruh komponen UI (Button, CustomInput, StatusView, Skeleton) dibangun manual untuk memenuhi requirement reusable component.

## Design System

Seluruh tampilan mengikuti satu design system terpusat di `src/constants/` — tidak ada nilai warna, ukuran font, spacing, shadow, atau string teks user-facing yang di-hardcode langsung di screen/komponen.

- **`colors.ts`** — skala neutral (abu-abu dingin) + satu warna aksen biru, dipakai konsisten sebagai satu-satunya warna mencolok di seluruh app.
- **`typography.ts`** — font **Inter** (400/500/600/700, dimuat via `@expo-google-fonts/inter`) dengan type scale tetap (`display`, `title`, `subtitle`, `body`, `caption`, dst). Setiap teks di app mengambil dari scale ini, bukan `fontSize`/`fontWeight` ad hoc.
- **`spacing.ts`** — 8-point spacing system (`4, 8, 12, 16, 24, 32, 40, 48`) dan radius **16–24px** untuk card/button (`999` khusus pill/avatar), plus `touchTarget.min = 44` untuk memastikan semua elemen interaktif memenuhi touch target minimum.
- **`shadows.ts`** — 3 tingkat soft shadow (`sm/md/lg`), opacity rendah, tanpa shadow keras atau border tebal.
- **`strings.ts`** — sentralisasi seluruh teks bahasa Indonesia (lokalisasi) yang ditampilkan di aplikasi, termasuk pesan error validasi, status API, placeholder, dan teks tombol.
- **`hooks/usePressAnimation.ts`** — micro-interaction scale-down-on-press yang konsisten di semua tombol, card produk, dan chip kategori, dijalankan di native thread (`useNativeDriver`) supaya tidak membebani performa.

Highlight desain per layar: Login/Register pakai layout terbuka (bukan form dalam kotak) dengan input filled-style (Material 3) dan CTA solid + link teks untuk aksi sekunder; Product Detail memakai floating back/wishlist button di atas gambar, "sheet" rounded-top yang menimpa foto, dan sticky bottom bar untuk aksi utama — pola yang umum dipakai Airbnb.

## Menjalankan Proyek

```bash
npm install
npm start
```

Lalu scan QR code dengan aplikasi **Expo Go**, atau tekan `a` / `i` / `w` untuk membuka di emulator Android/iOS/web.

Script lain:

```bash
npm run typecheck   # cek TypeScript
npm run lint        # cek ESLint
```

## Alur Aplikasi

```
Login/Register → Bottom Tab (Home, Wishlist, Profile) → Home → Product Detail
```

User **tidak bisa** mengakses Bottom Tab tanpa login terlebih dahulu — root navigator (`src/navigation/RootNavigator.tsx`) merender `AuthNavigator` atau `MainTabNavigator` secara kondisional berdasarkan `AuthContext`. Logout mengembalikan seluruh navigation tree ke Auth flow.

## Catatan Penting — Login & Register terhadap DummyJSON

DummyJSON `POST /auth/login` hanya menerima kredensial dari user seed yang sudah ada di database mereka; endpoint ini **tidak** benar-benar membuat user baru yang bisa login. Supaya alur Register → Login tetap benar-benar berfungsi end-to-end (bukan cuma demo API call), aplikasi ini pakai pendekatan hybrid:

- **Register** meminta Nama, **Username**, Email (format valid), dan Password. Setelah validasi lolos, aplikasi tetap memanggil `POST /users/add` sungguhan ke DummyJSON (mendemonstrasikan networking nyata dengan loading/success/error state), **lalu** menyimpan akun tersebut secara lokal di perangkat (`src/services/localAccountStore.ts`, via `AsyncStorage`) — karena DummyJSON sendiri tidak menyimpannya.
- **Login** mengecek username/password ke akun lokal tersebut terlebih dahulu. Kalau cocok, langsung berhasil masuk tanpa perlu koneksi internet. Kalau usernamenya tidak ditemukan secara lokal, aplikasi baru mencoba `POST /auth/login` sungguhan ke DummyJSON — ini yang membuat akun demo di bawah tetap berfungsi:
  - Username: `emilys`
  - Password: `emilyspass`

Setelah Register berhasil, Anda otomatis diarahkan ke Login dengan username sudah terisi — tinggal masukkan password yang baru saja dibuat.

> [!NOTE]
> **Catatan keamanan & hashing**: Untuk mengamankan kredensial akun lokal di `AsyncStorage`, aplikasi ini menerapkan hashing password menggunakan algoritma **SHA-256** (melalui fungsi murni TypeScript mandiri di `src/utils/crypto.ts`). Password tidak lagi disimpan dalam bentuk teks biasa (plain text), sehingga memenuhi standar keamanan terbaik meskipun ini adalah aplikasi demo/UAS.

## Struktur Folder

```
src/
├── components/     # Reusable UI components (common/ & product/)
├── screens/        # Layar per fitur (auth, home, product, wishlist, profile)
├── navigation/     # React Navigation setup (Bottom Tab dinamis dengan useSafeAreaInsets & Auth Gate)
├── context/        # Auth & Wishlist global state (Context API)
├── hooks/          # Custom hooks (useDebounce, useProducts, usePressAnimation)
├── services/       # Networking + local storage layer (satu-satunya pemanggil fetch/AsyncStorage)
├── types/          # TypeScript interfaces untuk shape API
├── utils/          # Fungsi validasi form, format helper, & utility kriptografi (crypto.ts)
└── constants/      # Design tokens (colors, typography, spacing, shadows, strings/lokalisasi) & endpoint API
```

## Keputusan Arsitektur Utama

- **State management**: Context API + `useState`/`useCallback`/`useMemo`, tanpa Redux/Zustand — scope aplikasi (2 state global: auth & wishlist) tidak membutuhkan library state management tambahan.
- **Error Boundary & Robustness**: Menggunakan React `ErrorBoundary` pada root aplikasi (`src/components/common/ErrorBoundary.tsx`) untuk mendeteksi crash JavaScript tak terduga secara anggun, menampilkan UI fallback yang ramah pengguna (`StatusView`), serta menyediakan aksi reload.
- **Pemuatan Gambar Berperforma Tinggi**: Menggunakan `expo-image` untuk performa render gambar produk yang cepat, dukungan caching disk otomatis, indikator loading asinkron, dan transisi visual cross-fade yang halus untuk mencegah kedipan layar.
- **Search & filter**: dilakukan di client-side dengan `useMemo` atas satu kali fetch produk (bukan re-fetch per keystroke), dikombinasikan dengan `useDebounce` custom hook untuk menghindari komputasi berlebihan saat mengetik.
- **Pemberitahuan & Status Reusable**: Mengintegrasikan komponen `StatusView` untuk menyederhanakan dan menstandarisasi visual loading, empty state, dan error state di seluruh aplikasi.
- **Service layer**: screen tidak pernah memanggil `fetch` langsung — semua lewat `src/services/*` agar error handling konsisten dan UI tetap bersih.
- **FlatList**: dipakai untuk seluruh list produk dengan `keyExtractor`, `renderItem` yang di-memoize, `ListEmptyComponent`, serta `React.memo` pada `ProductCard` untuk mencegah re-render berlebihan.

## Rubrik yang Dipenuhi

| Rubrik | Implementasi |
|---|---|
| Layout & Component | 3 screen responsif + 10 reusable component (termasuk Button baru dengan variasi variant, ProductImage optimal, dan Skeleton Loader pulsasi). |
| Lists & State Management | FlatList dengan skeleton loading/empty state, search ter-debounce + filter kategori via `useMemo`/`useCallback` |
| Form & Navigation | Validasi Login/Register penuh + submit-guard, Bottom Tab dinamis (berdasarkan safe area inset) dengan auth-gated navigation |
| Networking & API & Security | Service layer tangguh + loading/success/error state, login aman dengan enkripsi password SHA-256 lokal |
| Code Quality & Git | Penanganan error global (ErrorBoundary), struktur folder rapi, ESLint + Prettier, TypeScript strict mode, commit konvensional |ality & Git | Struktur folder rapi, ESLint + Prettier, TypeScript strict mode, commit konvensional |
