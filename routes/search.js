var express = require("express");
var router = express.Router();
const fsMovies = require("../Models/fsMoviesDal");
const restApiMovies = require("../Models/restApiMovies");

router.get("/", function (req, res, next) {
  if (!req.session.approved) {
    res.redirect("/login");
  } else {
    res.render("search", { title: "Search for a Movie" });
  }
});

let allMovies = [];

router.post("/find-data", async function (req, res, next) {
  if (!req.session.admin) {
    --req.session.transactions;
  }

  // Getting All Movies from WS and fs
  let allFs = await fsMovies.getFileData();
  let allWS = await restApiMovies.getMovies();
  let allWSData = allWS.data;

  // Adding the fsMovies to allWSMovies
  let searchedMovies = allWSData.concat(allFs);

  // Saving Back up for all movies
  allMovies = searchedMovies;
  let sameGenres = [];
  let concatGenres = [];

  // Narrowing search
  searchedMovies = req.body.moviename
    ? searchedMovies.filter(
        (item) => item.name.indexOf(req.body.moviename) > -1
      )
    : searchedMovies;
  searchedMovies = req.body.language
    ? searchedMovies.filter((item) => item.language == req.body.language)
    : searchedMovies;
  searchedMovies = req.body.genre
    ? searchedMovies.filter((item) => item.genres.indexOf(req.body.genre) > -1)
    : searchedMovies;

  // Filtering Movies from Same Genre if req.body.genre is not given
  if (!req.body.genre) {
    // Finding movies of same genre of searchedMovies
    searchedMovies.map((searchedMovie) => {
      searchedMovie.genres.forEach((genre) => {
        concatGenres = sameGenres.concat(
          allMovies.filter((item) => item.genres.indexOf(genre) > -1)
        );
      });
    });
  }

  if (searchedMovies[0]) {
    res.render("searchResults", {
      title: req.body.moviename,
      movies: searchedMovies,
      sameGenres: concatGenres,
    });
  } else {
    res.render("noresult", { title: "Movie wasn't found in archive" });
  }
});

router.get("/moviedata/:id", async function (req, res, next) {
  if (!req.session.admin) {
    if (req.session.transactions <= 0) {
      res.send("You have exceeded your transactions limit for today");
    }
    --req.session.transactions;
  }

  let [movieData] = allMovies.filter((item) => item.id == req.params.id);
  let { name, language, genres, image } = movieData;
  res.render("moviedata", {
    id: req.params.id,
    title: name,
    language: language,
    genres: genres,
    image: image ? image.medium : 0,
  });
});

module.exports = router;
