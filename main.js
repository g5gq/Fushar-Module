async function searchResults(query, page) {
    const url = `https://www.fushaar.com/page/${page}/?s=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const text = await response.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');

    const results = [];

    const items = doc.querySelectorAll('.Grid--WecimaPosts > article');

    for (const item of items) {
        const title = item.querySelector('h3 a')?.innerText?.trim();
        const image = item.querySelector('img')?.src;
        const pageUrl = item.querySelector('a')?.href;

        if (title && image && pageUrl) {
            results.push({
                title,
                image,
                url: pageUrl
            });
        }
    }

    const hasNextPage = !!doc.querySelector('.next.page-numbers');

    return {
        results,
        nextPage: hasNextPage
    };
}
