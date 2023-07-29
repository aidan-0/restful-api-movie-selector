let originalSearch = [];

const movieSearchBox = document.getElementById("movie-search-box");
const searchResult = document.getElementById("results");
const searchBtn = document.getElementById("search-btn");

//Function to fetch movies list from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=5fb49aab`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") displayMovieList(data.Search);
}

function displayMovieList(movies) {
  originalSearch = movies;
  searchResult.innerHTML = "";
  movies.forEach((movieData) => {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movieData.imdbID;
    movieListItem.classList.add("search-list-item");
    let moviePoster =
      movieData.Poster != "N/A" ? movieData.Poster : "image_not_found.png";
    // console.log(movieData);
    movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movieData.Title}</h3>
                <div class="info-grouping">
                    <p>${movieData.Year}</p>
                    <div href="watchlist.html" class="watchlist-group">
                    <p id="watchlist">Watchlist</p>
                    <iconify-icon id="plus-icon" icon="clarity:plus-circle-solid"></iconify-icon>
                    </div>
                </div>
            </div>



        `;
    searchResult.appendChild(movieListItem);
    handleClickWatchlist(movieListItem)
  });
  attachMovieDetailsListener();

  searchBtn.innerHTML = "Clear";
}

// Allow user to click on add to watchlist
function handleClickWatchlist(movieListItem) {
  const watchlistGroup = movieListItem.querySelector('.watchlist-group');
  watchlistGroup.addEventListener('click', (e) => {
    
      e.stopPropagation();
      
      // Get the existing watchlist from localStorage or create a new one
      let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
      
      const imdbID = movieListItem.dataset.id;
      
      // Check if movie is not already in the watchlist
      if (watchlist.indexOf(imdbID) === -1) {
          watchlist.push(imdbID);
          localStorage.setItem('watchlist', JSON.stringify(watchlist));
      }
  })
}


// Display Full Movie Details
function attachMovieDetailsListener() {
  const searchResultMovies = searchResult.querySelectorAll(".search-list-item");
  searchResultMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      const movieDetails = await getMovieDetails(movie.dataset.id);
      displayMovieDetails(movieDetails);
    //   console.log(getMovieDetails(movie.dataset.id));
    //   console.log("break");
    //   console.log(displayMovieDetails(movieDetails));
    });
  });
}

async function getMovieDetails(movieId) {
  const response = await fetch(
    `https://www.omdbapi.com/?i=${movieId}&apikey=5fb49aab`
  );
  return response.json();
}

function displayMovieDetails(data) {
  searchResult.innerHTML = `
        <div class="info">
            <img src=${data.Poster} class="poster">
            <div>
                <h2>${data.Title}</h2>
                <div class="rating">
                    <img src="star-icon.svg">
                    <h4>${data.imdbRating}</h4>
                </div>
                <div class="details">
                    <span>${data.Rated}</span>
                    <span>${data.Year}</span>
                    <span>${data.Runtime}</span>
                </div>
                <div class="genre">${data.Genre.split(",").join(
                  "</div><div>"
                )}</div>
                <p>Add to Watch List</p>
            </div>
        </div>
        <h3>Plot:</h3>
        <p>${data.Plot}</p>
        <h3>Cast:</h3>
        <p>${data.Actors}</p>
    `;

  searchBtn.innerHTML = "Back";
}





function handleSearch() {
    if (searchBtn.innerHTML === "Search") {
      let searchTerm = movieSearchBox.value.trim();
      if (searchTerm.length > 0) {
        searchResult.classList.remove("hide-search-list");
        loadMovies(searchTerm);
      }
    } else if (searchBtn.innerHTML === "Clear") {
      searchResult.innerHTML = "";
      searchBtn.innerHTML = "Search";
    } else if (searchBtn.innerHTML === "Back") {
      searchResult.innerHTML = "";
      searchBtn.innerHTML = "Clear";
      displayMovieList(originalSearch);
    }
  }

searchBtn.addEventListener("click", handleSearch);

movieSearchBox.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') { 
      handleSearch();
    }
  });


  async function getMovieById(imdbID) {
    const response = await fetch(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=5fb49aab`
    );
    return response.json();
}

function displayWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const resultsDiv = document.getElementById("watchlist-result");
    resultsDiv.innerHTML = '';

    watchlist.forEach(async (imdbID) => {
        let movieData = await getMovieById(imdbID);
        let movieListItem = document.createElement("div");
        movieListItem.dataset.id = movieData.imdbID;
        movieListItem.classList.add("search-list-item");
        let moviePoster =
            movieData.Poster != "N/A" ? movieData.Poster : "image_not_found.png";
        movieListItem.innerHTML = `
            <div class="search-item-thumbnail">
                <img src="${moviePoster}">
            </div>
            <div class="search-item-info">
                <h3>${movieData.Title}</h3>
                <div class="info-grouping">
                    <p>${movieData.Year}</p>
                </div>
            </div>
        `;
        resultsDiv.appendChild(movieListItem);
    });
}

// Call the displayWatchlist function on load
window.onload = function() {
    displayWatchlist();
};

  


/* todo:
- when selecting 'watch list' it should animate a colour change and not remove your search
- when clicking on the selected film in your watchlist it should show further details
- fix formatting on details page
- add loading circle on each click
- add a tick when watchlist has been added, after it loads
- remove from watchlist button
- hover colour on search list
- if user inputs less than 3 letters bring up a note saying that the user must enter 4 or more letters, and this is a limitation of the api pulling too many results.
-set button width

*/