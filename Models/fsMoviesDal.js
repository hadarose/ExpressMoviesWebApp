const jsonfile = require("jsonfile");

// Reads Movies File
exports.getFileData = async function () {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(
      __dirname + "/../Data/newMovies.json",
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

// Writes to Movies File
exports.addMovie = async function (obj) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(
      __dirname + "/../Data/newMovies.json",
      obj,
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve("Movie was added successfully");
        }
      }
    );
  });
};
