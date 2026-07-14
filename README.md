# UASPRak — Product Catalog App

Aplikasi mobile UAS Praktikum Pemrograman Mobile, dibangun dengan **React Native + Expo (TypeScript)**. Menampilkan katalog produk dari [DummyJSON](https://dummyjson.com) dengan autentikasi, pencarian, filter kategori, wishlist, dan navigasi bottom tab.

## Tech Stack

- **Expo** (managed workflow, SDK 57) + **TypeScript**
- **React Navigation** (native-stack + bottom-tabs)
- **Fetch API** untuk networking (tanpa Axios)
- **React Context API** untuk state global (tanpa Redux/Zustand — lihat alasan di bawah)
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

DummyJSON `POST /auth/login` hanya menerima kredensial dari user seed yang sudah ada di database mereka; endpoint ini **tidak** benar-benar membuat user baru yang bisa login. Untuk tetap jujur secara teknis sekaligus mendemonstrasikan integrasi networking yang nyata di kedua form:

- **Register** memvalidasi Nama, Email (format), dan Password, lalu benar-benar memanggil `POST /users/add` (loading/success/error state nyata).
- **Login** memvalidasi Username & Password, lalu memanggil `POST /auth/login` sungguhan. Gunakan akun demo yang tertera di layar Login:
  - Username: `emilys`
  - Password: `emilyspass`

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
