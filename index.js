const movies = document.getElementById('movies')
const input = document.getElementById('input')
const searchBtn = document.getElementById('search-btn')
const searchContainer = document.getElementById('search-container')


const watchlistEl = document.getElementById('movie-watchlist')
const body = document.getElementById('body')
const darkModeToggle = document.getElementById('dark-mode-toggle')
const moonIcon = document.querySelector('.fa-moon')
const watchlistContainer = document.querySelector('watchlist-container')


let darkMode = localStorage.getItem('darkMode')
console.log(localStorage)

const enableDarkMode = () => {
    document.body.classList.add('darkmode')
    darkModeToggle.classList.remove('fa-moon')
    darkModeToggle.classList.add('fa-sun')
    //update darkmode in local storage
    localStorage.setItem('darkMode', 'enabled')
}

const disableDarkMode = () => {
    document.body.classList.remove('darkmode')
    darkModeToggle.classList.add('fa-moon')
    darkModeToggle.classList.remove('fa-sun')
    //update darkmode in local storage
    localStorage.setItem('darkMode', null)
}

const enableDarkModeWatchlist = () => {
    watchlistEl.classList.add('darkmode')
}

const disableDarkModeWatchlist = () => {
    watchlistEl.classList.remove('darkmode')
}

if(darkMode === 'enabled') {
    enableDarkMode()
}

darkModeToggle.addEventListener('click', () => {
    darkMode = localStorage.getItem('darkMode')
    if(darkMode !== 'enabled') {
        enableDarkMode()
        enableDarkModeWatchlist()
    } else {
        disableDarkMode()
        disableDarkModeWatchlist()
    }
})

//array where movie data is stored to watchlist
let watchlistArray = JSON.parse(localStorage.getItem('watchlistArray'))

if(!watchlistArray) {
    watchlistArray = []
}

if(searchBtn) {
    searchBtn.addEventListener('click', handleSearch)
}

//fetch movie info from search
function handleSearch() {
    let searchInput = input.value
    fetch(`https://www.omdbapi.com/?s=${searchInput}&type=movie&apikey=f22aaadf`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            renderMovieHtml(data.Search)
    })
}

//render movie list html
function renderMovieHtml(movieResults) {
    let moviesHtml = ''
    for(let i = 0; i < movieResults.length; i++) {
        let movieTitle = movieResults[i].Title
       
        fetch(`https://www.omdbapi.com/?t=${movieTitle}&apikey=f22aaadf`)
            .then(res => res.json())
            .then(movie => {
                console.log(movie)
                moviesHtml += `
                <div class="movie-list">
                    <div class="movie-img"> 
                        <img class="movie-poster" src=${movie.Poster} />
                    </div>
                    <div class="movie-header">
                        <h2 class="movie-title">${movie.Title}</h2>
                        <i class="fa-solid fa-star"></i>
                        <p class="movie-rating">${movie.imdbRating}</p>
                    </div>
                    <div class="movie-subheader">
                        <p class="movie-runtime">${movie.Runtime}</p>
                        <p class="genre">${movie.Genre}</p>
                        <span class="add-movie" data-movie-id-add="${movie.imdbID}">Add To Watchlist</span>
                    </div>
                    <div class="movie-description">
                        <p class="description">${movie.Plot}</p>
                    </div>
                </div>
                `
                movies.innerHTML = moviesHtml
            })
    }
}

  
//listen for clicks on the add movie/remove movie dataset
document.addEventListener('click', (e) => {
    let movieAdded = e.target.dataset.movieIdAdd
    let movieRemoved = e.target.dataset.movieIdRemove

    if(movieAdded) {
        e.target.textContent = 'Added'
        addMovieToWatchlist(movieAdded)
       
    } else if(movieRemoved) {
        e.target.innerHTML = ''
        removeMovieFromWatchlist(movieRemoved)
    }
})

//render movies added to watchlist
function renderWatchlist() {
    if(!watchlistEl) return

    if(watchlistArray.length === 0) {
        watchlistEl.innerHTML = `
        <div class="empty">
            <img class="sloth-img" src="images/sloth.png"
            <p class="empty-list">Your watchlist is looking a bit empty...</p>
        </div>    
            `
    }

    let watchlistHtml = ''
    for(let movie of watchlistArray) {
        fetch(`https://www.omdbapi.com/?i=${movie}&type=movie&apikey=f22aaadf`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                watchlistHtml += `
                <div class="movie-list">
                <div class="movie-img"> 
                    <img class="movie-poster" src=${data.Poster} />
                </div>
                <div class="movie-header">
                    <h2 class="movie-title">${data.Title}</h2>
                    <i class="fa-solid fa-star"></i>
                    <p class="movie-rating">${data.imdbRating}</p>
                </div>
                <div class="movie-subheader">
                    <p class="movie-runtime">${data.Runtime}</p>
                    <p class="genre">${data.Genre}</p>
                    <span class="remove-movie" data-movie-id-remove="${data.imdbID}">Remove from watchlist</span>
                </div>
                <div class="movie-description">
                    <p class="description">${data.Plot}</p>
                </div>
            </div>
                `
                watchlistEl.innerHTML = watchlistHtml
            })
    }
}

renderWatchlist()

//add movies to watchlist
function addMovieToWatchlist(movieAdded) {
    //checks to see if selected movie is not in the array
    if(!watchlistArray.includes(movieAdded)) {
        watchlistArray.push(movieAdded)
        //updates local storage
       let local = localStorage.setItem('watchlistArray', JSON.stringify(watchlistArray))
        console.log(local)
    }
    renderWatchlist()
}


//remove movie from watchlist
function removeMovieFromWatchlist(movieRemoved) {
    for(let movie of watchlistArray) {
        if(movieRemoved === movie) {
            let movieIndex = watchlistArray.indexOf(movie)
            watchlistArray.splice(movieIndex, 1)
            //updates local storage
            localStorage.setItem('watchlistArray', JSON.stringify(watchlistArray))
        }
    }
    renderWatchlist()
}







