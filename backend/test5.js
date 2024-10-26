//test5: make it work for movies


const prompt = require('prompt-sync')();
require('dotenv').config();


const input = prompt("What movie are you looking for?");
const url = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(input)}&include_adult=false&language=en-US&page=1`;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
  }
};


fetch(url, options)
  .then(res => res.json())
  .then(json => {
    // Take the first six results
    const resultCount = json.results.slice(0,2);
    const simplifiedResults = resultCount.map(show => ({
        title: show.name,
        first_air_date: show.first_air_date,
        //probably better method fix later cool
        poster_path: show.poster_path,
        genre_ids: show.genre_ids,
        overview: show.overview
      }));

    console.log(simplifiedResults);
  })
  .catch(err => console.error(err));