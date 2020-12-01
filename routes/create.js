var express = require("express");
var router = express.Router();
const fsMovies = require("../Models/fsMoviesDal");
const restApiMovies = require("../Models/restApiMovies");

router.get("/", function (req, res, next) {
  if (!req.session.approved) {
    res.redirect("/login");
  } else {
    res.render("create", { title: "Create a New Movie" });
  }
});

router.post("/new", async function (req, res, next) {
  let newId = 0;

  // Checks if movie jsonfile is empty
  let movieArr = await fsMovies.getFileData();
  let lastFSid = getLastId(movieArr);

  if (lastFSid > 0) {
    newId = ++lastFSid;
  } else {
    //Get the last id from WS
    let allWS = await restApiMovies.getMovies();
    let movieRestArr = allWS.data;

    let lastRestId = getLastId(movieRestArr);
    newId = ++lastRestId;
  }

  let genreInput = req.body.genre;
  let genres = genreInput.split(", ");

  let newmovie = {
    id: newId,
    name: req.body.moviename,
    language: req.body.language,
    genres: genres,
  };

  // Adding the movie to the Array
  movieArr.push(newmovie);

  // Writes Array to json
  let createResult = await fsMovies.addMovie(movieArr);

  --req.session.transactions;
  res.render("success", { title: "OK", result: createResult });
});

// Assist function that receives an array and returns last id
function getLastId(arr) {
  let lastId = 0;

  if (arr[arr.length - 1]) {
    lastId = arr[arr.length - 1].id;
  }
  return lastId;
}

module.exports = router;
