let originalSearch = [];

const movieSearchBox = document.getElementById("movie-search-box");
const searchResult = document.getElementById("results");
const searchBtn = document.getElementById("search-btn");
const removeBtn = document.getElementById("remove-watchlist");
const watchlistResultDiv = document.getElementById("watchlist-result");

//Function to fetch movies list from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=5fb49aab`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") {
    displayMovieList(data.Search)
    searchResult.classList.remove("results-error-styling")
  } else {
    console.log(data.Error)
    searchResult.innerHTML = data.Error
    searchResult.classList.add("results-error-styling")
  }
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
    handleClickWatchlist(movieListItem);
  });
  attachMovieDetailsListener();

  searchBtn.innerHTML = "Clear";

  movieSearchBox.addEventListener('input', function() {
    searchBtn.innerHTML = "Search"
  })
}

// Allow user to click on add to watchlist
function handleClickWatchlist(movieListItem) {
  const watchlistGroup = movieListItem.querySelector(".watchlist-group");
  const icon = watchlistGroup.querySelector("iconify-icon");

  watchlistGroup.addEventListener("click", (e) => {
    e.stopPropagation();

    // Get the existing watchlist from localStorage or create a new one
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const imdbID = movieListItem.dataset.id;

    if (icon.getAttribute("id") === "plus-icon") {
      // Check if movie is not already in the watchlist
      if (watchlist.indexOf(imdbID) === -1) {
        watchlist.push(imdbID);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
      }
      icon.setAttribute("id", "tick-icon");
      icon.setAttribute("icon", "mdi:tick-circle");
    } else if (icon.getAttribute("id") === "tick-icon") {
      // Remove from watchlist and change to plus
      const index = watchlist.indexOf(imdbID);
      if (index !== -1) {
        watchlist.splice(index, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
      }
      icon.setAttribute("id", "plus-icon");
      icon.setAttribute("icon", "clarity:plus-circle-solid");
    }
  });
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
  if (event.key === "Enter") {
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
  const watchlistItemsDiv = document.getElementById("watchlist-items");
  const watchlistMessageDiv = document.getElementById("watchlist-message"); // <--- This is your message div

  if (!watchlistItemsDiv) {
      return;
  }

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  watchlistItemsDiv.innerHTML = "";

  if (watchlist.length === 0) { 
      watchlistMessageDiv.style.display = "flex"; 
  } else {
      watchlistMessageDiv.style.display = "none"; 

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
                      <div href="watchlist.html" class="watchlist-group">
                      <p id="watchlist" class="remove-watchlist">Remove From Watchlist</p>
                      <iconify-icon id="minus-icon" icon="akar-icons:circle-minus-fill"></iconify-icon>
                      </div>
                  </div>
              </div>
          `;
          watchlistItemsDiv.appendChild(movieListItem);
      });
  }
}




window.onload = function () {
  displayWatchlist();
};



// Remove from watchlist
if (watchlistResultDiv) {
  watchlistResultDiv.addEventListener("click", function (event) {
    // Determine if the clicked element or its parent is the remove button
    let target = event.target;
    while (target !== this && !target.classList.contains("watchlist-group")) {
      target = target.parentElement;
    }

    // If we found the remove button
    if (target !== this) {
      const movieListItem = target.closest(".search-list-item");
      const imdbID = movieListItem.dataset.id;

      let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

      // Check if the movie exists in the watchlist
      const index = watchlist.indexOf(imdbID);
      if (index !== -1) {
        watchlist.splice(index, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));

        // Refresh the display of the watchlist
        displayWatchlist();
      }
    }
  });
}
