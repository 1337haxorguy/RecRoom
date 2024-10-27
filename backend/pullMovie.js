const prompt = require('prompt-sync')();
require('dotenv').config();

function pullMovie(input) {
    // Use the "movie" endpoint instead of "tv"
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(input)}&include_adult=false&language=en-US&page=1`;

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
            if (!json.results || !Array.isArray(json.results)) {
                console.error("Invalid results structure:", json);
                return [];
            }

            // Extract only the titles of the first 2 movies
            const movieNames = json.results.slice(0, 2).map(movie => movie.title);

            console.log(movieNames); // Log for debugging
            return movieNames; // Return an array of movie names
        })
        .catch(err => {
            console.error("Error fetching movie data:", err);
            return [];
        });
}

module.exports = { pullMovie };
