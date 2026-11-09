/*
 AVRENWIBUID — penghubung API.
 Dokumentasi API: https://docsapi.nanimelaina.web.id/
 Catatan: endpoint spesifik belum diisi karena perlu dicocokkan dengan dokumentasi
 endpoint yang benar. Jangan menebak URL endpoint atau menaruh API key rahasia di sini.
*/
const API_BASE = "https://v1312.nanimelaina.web.id";
const API_ENDPOINTS = {
  // Isi setelah memilih endpoint yang tepat dari dokumentasi, contoh:
  // animeList: "/PATH-ENDPOINT-DAFTAR-ANIME"
  animeList: ""
};

const grid = document.getElementById("animeGrid");
const statusBox = document.getElementById("status");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const loadMore = document.getElementById("loadMore");
let allAnime = [];
let activeFilter = "all";
let visibleCount = 15;

document.getElementById("year").textContent = new Date().getFullYear();

function pick(obj, keys, fallback = "") {
  for (const key of keys) if (obj?.[key] != null && obj[key] !== "") return obj[key];
  return fallback;
}
function normalizeAnime(item) {
  return {
    title: pick(item, ["title", "name", "judul", "anime_title"], "Anime tanpa judul"),
    image: pick(item, ["poster", "image", "cover", "thumbnail", "poster_url"], ""),
    type: String(pick(item, ["type", "format", "kind"], "series")).toLowerCase(),
    episode: pick(item, ["episodes", "episode_count", "total_episode"], ""),
    raw: item
  };
}
function isMovie(anime) {
  return /movie|film/.test(anime.type);
}
function render() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = allAnime.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(term);
    const matchesType = activeFilter === "all" || (activeFilter === "movie" ? isMovie(a) : !isMovie(a));
    return matchesSearch && matchesType;
  });
  resultCount.textContent = `${filtered.length} anime`;
  const shown = filtered.slice(0, visibleCount);
  grid.innerHTML = "";
  if (!shown.length) {
    grid.innerHTML = '<div class="empty">Anime tidak ditemukan. Coba kata kunci lain.</div>';
  } else {
    for (const anime of shown) {
      const card = document.createElement("article");
      card.className = "anime-card";
      const poster = document.createElement("div");
      poster.className = "poster-wrap";
      const img = document.createElement("img");
      img.loading = "lazy";
      img.alt = `Poster ${anime.title}`;
      img.src = anime.image || "https://placehold.co/360x500/191827/c8b9ff?text=AVRENWIBUID";
      const tag = document.createElement("span");
      tag.className = "poster-tag";
      tag.textContent = isMovie(anime) ? "FILM" : "SERIAL";
      poster.append(img, tag);
      const info = document.createElement("div");
      info.className = "anime-info";
      const title = document.createElement("h3");
      title.textContent = anime.title;
      const meta = document.createElement("p");
      meta.textContent = anime.episode ? `${anime.episode} episode` : "Anime";
      info.append(title, meta);
      card.append(poster, info);
      card.addEventListener("click", () => {
        alert("Kartu anime sudah tampil. Halaman detail dan pemutar akan dihubungkan setelah endpoint detail/stream dikonfirmasi.");
      });
      grid.append(card);
    }
  }
  loadMore.hidden = filtered.length <= visibleCount;
}
async function loadAnime() {
  if (!API_ENDPOINTS.animeList) {
    statusBox.textContent = "Tampilan awal siap. Endpoint daftar anime belum dipasang—kirim contoh endpoint dan respons JSON dari dokumentasi agar data asli bisa ditampilkan.";
    allAnime = [];
    render();
    return;
  }
  try {
    statusBox.textContent = "Mengambil data anime...";
    const response = await fetch(new URL(API_ENDPOINTS.animeList, API_BASE));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    const list = Array.isArray(json) ? json : pick(json, ["data", "results", "anime", "items"], []);
    if (!Array.isArray(list)) throw new Error("Format respons belum dikenali.");
    allAnime = list.map(normalizeAnime);
    statusBox.textContent = allAnime.length ? "" : "Belum ada data anime dari API.";
    render();
  } catch (error) {
    statusBox.textContent = `Gagal mengambil data API: ${error.message}. Periksa endpoint dan izin CORS.`;
  }
}
document.getElementById("searchForm").addEventListener("submit", e => { e.preventDefault(); visibleCount = 15; render(); });
searchInput.addEventListener("input", () => { visibleCount = 15; render(); });
document.querySelectorAll(".filter-chip").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".filter-chip.selected")?.classList.remove("selected");
  button.classList.add("selected");
  activeFilter = button.dataset.filter;
  visibleCount = 15;
  render();
}));
loadMore.addEventListener("click", () => { visibleCount += 15; render(); });
loadAnime();
