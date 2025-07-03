/* jshint esversion: 11 */
/* global soraFetch */

async function searchResults(keyword) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=68e094699525b18a70bab2f86b1fa706&query=${encodeURIComponent(keyword)}`;
  const r = await soraFetch(url);
  if (!r || r.status !== 200) return JSON.stringify([]);

  const data = await r.json();
  return JSON.stringify(data.results.map(movie => ({
    title: movie.title,
    href: movie.id.toString(),
    image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
  })));
}

async function extractDetails(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=68e094699525b18a70bab2f86b1fa706`;
  const r = await soraFetch(url);
  if (!r || r.status !== 200) return JSON.stringify({});

  const m = await r.json();
  return JSON.stringify({
    description: m.overview || "",
    aliases: `Released: ${m.release_date || "Unknown"}`,
    airdate: m.release_date || "",
    extra: `Genres: ${m.genres.map(g => g.name).join(", ")}`
  });
}

async function extractEpisodes(movieId) {
  return JSON.stringify([{ href: movieId, number: 1 }]);
}

async function extractStreamUrl(movieId) {
  const streamUrl = `https://vidsrc.to/embed/movie/${movieId}`;
  return JSON.stringify({
    streams: [{ title: "Watch", streamUrl }],
    subtitles: []
  });
}
