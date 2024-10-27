require('dotenv').config();

function getCoverImage(title, type = 'movie') {
    // Determine the endpoint based on the type ("movie" or "tv")
    const url = `https://api.themoviedb.org/3/search/${type}?query=${encodeURIComponent(title)}&include_adult=false&language=en-US&page=1`;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
    };

    return fetch(url, options)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(json => {
            if (!json.results || !Array.isArray(json.results) || json.results.length === 0) {
                console.error("No results found or invalid response structure:", json);
                return null;
            }

            const firstResult = json.results[0]; // Take the first matching result
            const posterPath = firstResult.poster_path;

            if (!posterPath) {
                console.log("No cover image available for this title.");
                return null;
            }

            // Construct the full image URL using TMDb's base URL and the poster path
            const coverImageUrl = `https://image.tmdb.org/t/p/w500${posterPath}`;
            console.log("Cover Image URL:", coverImageUrl);
            return coverImageUrl;
        })
        .catch(err => {
            console.error("Error fetching cover image data:", err);
            return null;
        });
}

module.exports = { getCoverImage };
