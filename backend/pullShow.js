const prompt = require('prompt-sync')();
require('dotenv').config();

function pullShow(input) {
    const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(input)}&include_adult=false&language=en-US&page=1`;

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

            // Extract only the titles of the first 2 shows
            const showNames = json.results.slice(0, 2).map(show => show.name);

            console.log(showNames); // Log for debugging
            return showNames; // Return an array of show names
        })
        .catch(err => {
            console.error("Error fetching show data:", err);
            return [];
        });
}


module.exports = { pullShow };
