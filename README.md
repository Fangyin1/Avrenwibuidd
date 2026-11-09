# AVRENWIBUID

Website anime berbahasa Indonesia menggunakan HTML, CSS, dan JavaScript murni.

## Jalankan lokal
Buka `index.html` di browser, atau gunakan ekstensi Live Server di VS Code.

## Deploy ke Vercel
1. Buat repository GitHub dan unggah semua file dalam folder ini.
2. Di Vercel, pilih **Add New → Project** dan impor repository.
3. Framework Preset: **Other**.
4. Build Command dan Output Directory dapat dikosongkan (root proyek).
5. Klik Deploy.

## Integrasi API
Buka `script.js`, lalu isi `API_ENDPOINTS.animeList` dengan path endpoint daftar anime yang benar dari dokumentasi Nanimelaina. Sesuaikan `normalizeAnime()` dengan nama properti respons JSON yang sebenarnya.

Endpoint yang dipakai belum ditebak. Kirim contoh URL endpoint daftar anime beserta contoh JSON responsenya agar integrasi detail, episode, dan streaming dapat dibuat akurat.

Jangan simpan API key/token rahasia di JavaScript sisi browser. Gunakan Vercel Functions untuk kredensial rahasia atau endpoint yang perlu diproksikan. Pastikan konten dan sumber streaming yang digunakan memiliki izin yang sesuai.
