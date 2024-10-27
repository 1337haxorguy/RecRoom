// server.js
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index2.html'));
});

app.get('/questions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'questions.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Function to fetch show names from TMDB
function pullShow(input) {
    const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(input)}&include_adult=false&language=en-US&page=1`;

    console.log("APIO OGKNSFOUBDSNOBDSF"  + process.env.TMDB_API_KEY)
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
            const showNames = json.results.slice(0, 8).map(show => show.name);

            console.log(showNames); // Log for debugging
            return showNames; // Return an array of show names
        })
        .catch(err => {
            console.error("Error fetching show data:", err);
            return [];
        });
}

function pullMovie(input) {
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
            const movieNames = json.results.slice(0, 6).map(movie => movie.title);

            console.log(movieNames); // Log for debugging
            return movieNames; // Return an array of movie names
        })
        .catch(err => {
            console.error("Error fetching movie data:", err);
            return [];
        });
}



// API endpoint to handle the pull show request
app.post('/api/pullShow', async (req, res) => {
    const input = req.body.input;

    // Call the pullShow function and handle the response
    const showNames = await pullShow(input);
    return res.json(showNames);
});

app.post('/api/pullMovie', async (req, res) => {
    const input = req.body.input;

    // Call the pullShow function and handle the response
    const showNames = await pullMovie(input);
    return res.json(showNames);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
