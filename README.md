# UASPRak — Product Catalog App

Aplikasi mobile UAS Praktikum Pemrograman Mobile, dibangun dengan **React Native + Expo (TypeScript)**. Menampilkan katalog produk dari [DummyJSON](https://dummyjson.com) dengan autentikasi, pencarian, filter kategori, wishlist, dan navigasi bottom tab.

## Tech Stack

- **Expo** (managed workflow, SDK 54) + **TypeScript**
- **React Navigation** (native-stack + bottom-tabs)
- **Fetch API** untuk networking (tanpa Axios)
- **React Context API** untuk state global (tanpa Redux/Zustand — lihat alasan di bawah)
- **AsyncStorage** khusus untuk menyimpan akun yang didaftarkan secara lokal (lihat "Catatan Penting" di bawah)
- **ESLint** (`eslint-config-expo`) + **Prettier**

Tidak ada library UI kit pihak ketiga (NativeBase, RN Paper, dll) — seluruh komponen dibangun manual untuk memenuhi requirement reusable component.

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

> Catatan keamanan: password akun lokal disimpan apa adanya (plain text) di `AsyncStorage`. Ini simplifikasi yang disengaja untuk kebutuhan demo/UAS (DummyJSON memang tidak punya endpoint registrasi asli) — jangan pernah dipakai untuk aplikasi produksi sungguhan.

## Struktur Folder

```
src/
├── components/     # Reusable UI components (common/ & product/)
├── screens/        # Layar per fitur (auth, home, product, wishlist, profile)
├── navigation/      # React Navigation setup + tipe param list
├── context/         # Auth & Wishlist global state (Context API)
├── hooks/           # Custom hooks (useDebounce, useProducts)
├── services/        # Networking layer (satu-satunya pemanggil fetch)
├── types/           # TypeScript interfaces untuk shape API
├── utils/           # Fungsi validasi form (pure functions)
└── constants/        # Design tokens (warna, spacing) & endpoint API
```

## Keputusan Arsitektur Utama

- **State management**: Context API + `useState`/`useCallback`/`useMemo`, tanpa Redux/Zustand — scope aplikasi (2 state global: auth & wishlist) tidak membutuhkan library state management tambahan.
- **Search & filter**: dilakukan di client-side dengan `useMemo` atas satu kali fetch produk (bukan re-fetch per keystroke), dikombinasikan dengan `useDebounce` custom hook untuk menghindari komputasi berlebihan saat mengetik.
- **Service layer**: screen tidak pernah memanggil `fetch` langsung — semua lewat `src/services/*` agar error handling konsisten dan UI tetap bersih.
- **FlatList**: dipakai untuk seluruh list produk dengan `keyExtractor`, `renderItem` yang di-memoize, `ListEmptyComponent`, serta `React.memo` pada `ProductCard` untuk mencegah re-render berlebihan.

## Rubrik yang Dipenuhi

| Rubrik | Implementasi |
|---|---|
| Layout & Component | 3 screen responsif (Flexbox, tanpa hardcoded width/height) + 7 reusable component |
| Lists & State Management | FlatList dengan loading/empty state, search + filter kategori via `useMemo`/`useCallback` |
| Form & Navigation | Validasi Login/Register penuh + submit-guard, Bottom Tab dengan auth-gated navigation |
| Networking & API | Service layer + loading/success/error state di setiap fetch, tidak crash saat gagal |
| Code Quality & Git | Struktur folder rapi, ESLint + Prettier, TypeScript strict mode, commit konvensional |
