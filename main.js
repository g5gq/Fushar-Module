async function searchResults(query) {
  const searchUrl = `https://vidsrc.to/search?query=${encodeURIComponent(query)}`;
  const html = await fetch(searchUrl).then(res => res.text());

  const results = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const cards = doc.querySelectorAll('.video-block a[href*="/movie/"]');

  for (const card of cards) {
    const title = card.querySelector('.name')?.textContent?.trim();
    const poster = card.querySelector('img')?.getAttribute('data-src') || card.querySelector('img')?.src;
    const url = card.href;

    if (title && url) {
      results.push({
        title,
        image: poster,
        url
      });
    }
  }

  return JSON.stringify(results);
}
