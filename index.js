let originalSearch = [];
let currentPage = 1;

const movieSearchBox = document.getElementById("movie-search-box");
const searchResult = document.getElementById("results");
const searchBtn = document.getElementById("search-btn");
const removeBtn = document.getElementById("remove-watchlist");
const watchlistResultDiv = document.getElementById("watchlist-result");
const prevBtn = document.getElementById("prevBtn")
const nextBtn = document.getElementById("nextBtn")

//Function to fetch movies list from API
async function loadMovies(searchTerm, currentPage) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=${currentPage}&apikey=5fb49aab`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") {
    displayMovieList(data.Search);
    searchResult.classList.remove("results-error-styling");
  } else {
    searchResult.innerHTML = data.Error;
    searchResult.classList.add("results-error-styling");
  }
}

function displayMovieList(movies) {
  originalSearch = movies;
  searchResult.innerHTML = "";
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

  movies.forEach((movieData) => {
    let isInWatchlist = watchlist.indexOf(movieData.imdbID) !== -1;
    let iconId = isInWatchlist ? "tick-icon" : "plus-icon";
    let iconName = isInWatchlist ? "mdi:tick-circle" : "clarity:plus-circle-solid"
    
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movieData.imdbID;
    movieListItem.classList.add("search-list-item");
    let moviePoster = movieData.Poster != "N/A" ? movieData.Poster : "image_not_found.png";

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
                    <iconify-icon id="${iconId}" icon="${iconName}"></iconify-icon>
                    </div>
                </div>
            </div>
        `;
    searchResult.appendChild(movieListItem);
    handleClickWatchlist(movieListItem);
  });
  attachMovieDetailsListener();

  searchBtn.innerHTML = "Clear";

  movieSearchBox.addEventListener("input", function () {
    searchBtn.innerHTML = "Search";
  });
}

// Allow user to click on add to watchlist
function toggleMovieInWatchlist(movieId, iconElement) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  // If movie is not in watchlist, add it
  if (iconElement.getAttribute("id") === "plus-icon") {
    if (watchlist.indexOf(movieId) === -1) {
      watchlist.push(movieId);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
    iconElement.setAttribute("id", "tick-icon");
    iconElement.setAttribute("icon", "mdi:tick-circle");
  }
  // If movie is in watchlist, remove it
  else if (iconElement.getAttribute("id") === "tick-icon") {
    const index = watchlist.indexOf(movieId);
    if (index !== -1) {
      watchlist.splice(index, 1);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
    iconElement.setAttribute("id", "plus-icon");
    iconElement.setAttribute("icon", "clarity:plus-circle-solid");
  }
}

function handleClickWatchlist(movieListItem) {
  const watchlistGroup = movieListItem.querySelector(".watchlist-group");
  const icon = watchlistGroup.querySelector("iconify-icon");

  watchlistGroup.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMovieInWatchlist(movieListItem.dataset.id, icon);
  });
}

// Display Full Movie Details
function attachMovieDetailsListener() {
  const searchResultMovies = searchResult.querySelectorAll(".search-list-item");
  searchResultMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      const movieDetails = await getMovieDetails(movie.dataset.id);
      displayMovieDetails(movieDetails);
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
                <div class="genre">
                    ${data.Genre.split(",")
                      .map((genre) => `<div>${genre}</div>`)
                      .join("")}
                </div>
                <div class="details-watchlist">
                    <p>Watchlist</p>
                    <iconify-icon id="plus-icon" icon="clarity:plus-circle-solid"></iconify-icon>
                </div>
            </div>
        </div>
        <h3>Plot:</h3>
        <p>${data.Plot}</p>
        <h3>Cast:</h3>
        <p>${data.Actors}</p>
    `;

  searchBtn.innerHTML = "Back";
  const detailsWatchlistDiv = searchResult.querySelector(".details-watchlist");
  const detailsWatchlistIcon =
    detailsWatchlistDiv.querySelector("iconify-icon");

  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  if (watchlist.indexOf(data.imdbID) !== -1) {
    detailsWatchlistIcon.setAttribute("id", "tick-icon");
    detailsWatchlistIcon.setAttribute("icon", "mdi:tick-circle");
  }

  detailsWatchlistDiv.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMovieInWatchlist(data.imdbID, detailsWatchlistIcon);
  });
}

function handleSearch() {
  if (searchBtn.innerHTML === "Search") {
    let searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
      searchResult.classList.remove("hide-search-list");
      currentPage = 1;
      handlePageButtons()
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



prevBtn.addEventListener("click", function() {
  if(currentPage > 1) {
    currentPage--;
    console.log("Current Page After Increment: ", currentPage); // Log 1
    loadMovies(movieSearchBox.value, currentPage);
  }
  handlePageButtons();
})

nextBtn.addEventListener("click", function() {
  currentPage++;
  console.log("Current Page After Increment: ", currentPage); // Log 1
  loadMovies(movieSearchBox.value, currentPage);
  handlePageButtons();
})

// Toggle between pages
function handlePageButtons() {
  const prevBtnChildren = prevBtn.children;
  if (currentPage === 1) {
    for (let child of prevBtnChildren) {
      child.classList.add("hide-prev-btn")
    }
  } else {
    for (let child of prevBtnChildren) {
      child.classList.remove("hide-prev-btn")
    }
  }
}


window.onload = function () {
  displayWatchlist();
  handlePageButtons();
};