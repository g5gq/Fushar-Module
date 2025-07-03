export async function searchResults(query) {
    const tmdbKey = "68e094699525b18a70bab2f86b1fa706";
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(query)}`;

    const res = await fetch(url);
    const json = await res.json();
    const results = json.results.map(movie => ({
        id: movie.id.toString(),
        title: movie.title,
        image: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
        description: movie.overview,
    }));

    return JSON.stringify(results);
}

export async function extractDetails(id) {
    const tmdbKey = "68e094699525b18a70bab2f86b1fa706";
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}`;

    const res = await fetch(url);
    const movie = await res.json();

    return JSON.stringify({
        title: movie.title,
        image: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
        description: movie.overview,
        genres: movie.genres.map(g => g.name),
    });
}

export async function extractEpisodes(id) {
    return JSON.stringify([
        {
            id: id,
            title: "Watch Now",
        }
    ]);
}

export async function extractStreamUrl(id) {
    return JSON.stringify({
        stream: `https://vidsrc.to/embed/movie/${id}`,
        headers: {
            Referer: "https://vidsrc.to/",
        }
    });
}
