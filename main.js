async function searchResults(keyword) {
    try {
        const encodedKeyword = encodeURIComponent(keyword);
        const searchUrl = `https://fushaar.cam/wp-json/dooplayer/search?s=${encodedKeyword}`;
        const response = await soraFetch(searchUrl);
        const data = await response.json();

        const results = data.map(item => ({
            title: item.title,
            image: item.poster,
            href: item.link
        }));

        return JSON.stringify(results);
    } catch (error) {
        console.log("searchResults error:", error);
        return JSON.stringify([{ title: "Error", image: "", href: "" }]);
    }
}

async function extractDetails(url) {
    try {
        const res = await soraFetch(url);
        const text = await res.text();

        const description = (text.match(/<div class="entry-content">(.*?)<\/div>/s) || [])[1]?.replace(/<[^>]*>/g, "").trim() || "No description";
        const released = (text.match(/Released:\s*(\d{4})/) || [])[1] || "Unknown";

        return JSON.stringify([{
            description,
            airdate: `Released: ${released}`,
            aliases: ""
        }]);
    } catch (error) {
        console.log("extractDetails error:", error);
        return JSON.stringify([{ description: "Error", airdate: "", aliases: "" }]);
    }
}

async function extractEpisodes(url) {
    return JSON.stringify([{ href: url, number: 1, title: "Watch" }]);
}

async function extractStreamUrl(url) {
    try {
        const res = await soraFetch(url);
        const html = await res.text();

        const match = html.match(/player.src\(["'](.*?)["']\)/) || html.match(/"file"\s*:\s*"(https:\/\/[^"]+)"/);
        const stream = match?.[1];

        if (!stream) throw new Error("No stream found");

        return JSON.stringify({ stream });
    } catch (error) {
        console.log("extractStreamUrl error:", error);
        return JSON.stringify({ stream: "" });
    }
}

async function soraFetch(url, options = { headers: {}, method: 'GET', body: null }) {
    try {
        return await fetchv2(url, options.headers ?? {}, options.method ?? 'GET', options.body ?? null);
    } catch (e) {
        try {
            return await fetch(url, options);
        } catch (error) {
            return null;
        }
    }
}
