/* jshint esversion: 11 */
/* global fetchv2 */

async function searchResults(keyword) {
    const results = [];
    const url = `https://www.fushaar.com/?s=${encodeURIComponent(keyword)}`;
    const response = await soraFetch(url);
    const html = await response.text();

    const regex = /<a href="(https:\/\/www\.fushaar\.com\/movie\/[^"]+)"[^>]*>\s*<img src="([^"]+)"[^>]+alt="([^"]+)"/g;

    let match;
    while ((match = regex.exec(html)) !== null) {
        results.push({
            title: match[3].trim(),
            href: match[1].trim(),
            image: match[2].trim()
        });
    }

    return JSON.stringify(results);
}

async function extractDetails(url) {
    const response = await soraFetch(url);
    const html = await response.text();

    const descriptionMatch = html.match(/<div class="story">[\s\S]*?<p>(.*?)<\/p>/);
    const durationMatch = html.match(/المدة\s*:\s*<\/strong>\s*(.*?)</);
    const yearMatch = html.match(/الإصدار\s*:\s*<\/strong>\s*(\d{4})/);

    return JSON.stringify([{
        description: descriptionMatch ? descriptionMatch[1].trim() : "No description",
        aliases: "",
        airdate: yearMatch ? yearMatch[1] : "N/A",
        extra: durationMatch ? "⏱️ " + durationMatch[1] : ""
    }]);
}

async function extractEpisodes(url) {
    return JSON.stringify([{ href: url, number: 1 }]);
}

async function extractStreamUrl(url) {
    const response = await soraFetch(url);
    const html = await response.text();

    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+player\.php\?id=\d+)"[^>]*>/);
    const iframeUrl = iframeMatch ? iframeMatch[1] : null;

    if (!iframeUrl) {
        return JSON.stringify({ streams: [], subtitles: [] });
    }

    return JSON.stringify({
        streams: [{
            title: "Fushaar Player",
            streamUrl: iframeUrl,
            headers: {
                Referer: url
            }
        }],
        subtitles: []
    });
}

async function soraFetch(url, options = { headers: {}, method: 'GET', body: null }) {
    try {
        return await fetchv2(url, options.headers ?? {}, options.method ?? 'GET', options.body ?? null);
    } catch {
        try {
            return await fetch(url, options);
        } catch {
            return null;
        }
    }
}
