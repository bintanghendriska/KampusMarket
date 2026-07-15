export const strings = {
  // Common
  appName: 'UASPRak',
  loading: 'Memuat data...',
  retry: 'Coba Lagi',
  back: 'Kembali',
  save: 'Simpan',
  delete: 'Hapus',
  cancel: 'Batal',

  // Validation Errors
  validation: {
    nameRequired: 'Nama wajib diisi',
    nameMin: (min: number) => `Nama minimal ${min} karakter`,
    emailRequired: 'Email wajib diisi',
    emailInvalid: 'Format email tidak valid',
    usernameRequired: 'Username wajib diisi',
    usernameMin: (min: number) => `Username minimal ${min} karakter`,
    usernameTaken: 'Username sudah digunakan, pilih username lain',
    passwordRequired: 'Password wajib diisi',
    passwordMin: (min: number) => `Password minimal ${min} karakter`,
  },

  // API Errors & Transport
  api: {
    timeout: 'Koneksi timeout. Periksa jaringan Anda.',
    noConnection: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    requestFailed: (status: number) => `Permintaan gagal (status ${status})`,
    invalidCredentials: 'Username atau password salah',
    unknownError: 'Terjadi kesalahan, silakan coba lagi.',
    registerFailed: 'Registrasi gagal, coba lagi.',
  },

  // Auth Screens
  auth: {
    loginTitle: 'Selamat datang kembali',
    loginSubtitle: 'Masuk untuk melanjutkan belanja Anda',
    loginButton: 'Masuk',
    loginDemoHint: 'Belum daftar? Coba akun demo ',
    loginRegisterLink: 'Belum punya akun? Daftar',
    registerTitle: 'Buat akun baru',
    registerSubtitle: 'Isi data di bawah untuk mulai berbelanja',
    registerButton: 'Daftar',
    registerLoginLink: 'Sudah punya akun? Masuk',
    registerSuccessBanner: 'Registrasi berhasil. Masukkan password Anda untuk masuk.',
    
    // Form Placeholders & Labels
    labelName: 'Nama',
    placeholderName: 'Masukkan nama lengkap',
    labelUsername: 'Username',
    placeholderUsername: 'Masukkan username',
    placeholderRegisterUsername: 'Buat username untuk login',
    labelEmail: 'Email',
    placeholderEmail: 'Masukkan email',
    labelPassword: 'Password',
    placeholderPassword: 'Masukkan password',
  },

  // Home Screen
  home: {
    title: 'Katalog Produk',
    subtitle: (count: number) => `${count} produk tersedia`,
    searchPlaceholder: 'Cari produk...',
    emptyTitle: 'Produk tidak ditemukan',
    emptyMessage: 'Coba ubah kata kunci pencarian atau kategori',
    categoryAll: 'Semua',
    loadProductsError: 'Gagal memuat produk',
  },

  // Wishlist Screen
  wishlist: {
    title: 'Wishlist Saya',
    count: (count: number) => `${count} produk disimpan`,
    emptyCount: 'Belum ada produk disimpan',
    emptyTitle: 'Wishlist masih kosong',
    emptyMessage: 'Tambahkan produk favorit Anda dari katalog',
    addedToWishlist: 'Ditambahkan ke wishlist',
    removedFromWishlist: 'Dihapus dari wishlist',
    undo: 'Urungkan',
  },

  // Profile Screen
  profile: {
    title: 'Profil',
    wishlistLabel: 'Wishlist',
    wishlistValue: (count: number) => `${count} produk disimpan`,
    usernameLabel: 'Username',
    logoutButton: 'Logout',
  },

  // Product Detail Screen
  detail: {
    categoryLabel: 'Kategori',
    ratingLabel: 'Rating',
    stockAvailable: (stock: number) => `Stok tersedia: ${stock}`,
    stockEmpty: 'Stok habis',
    descriptionTitle: 'Deskripsi',
    ctaPriceLabel: 'Harga',
    ctaAddWishlist: 'Tambah ke Wishlist',
    ctaRemoveWishlist: 'Hapus dari Wishlist',
    loadDetailError: 'Gagal memuat detail produk',
    productNotFound: 'Produk tidak ditemukan',
  },
} as const;
