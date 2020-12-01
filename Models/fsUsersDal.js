const jsonfile = require("jsonfile");

exports.getUserData = async function () {
  return new Promise((resolve, reject) => {
    jsonfile.readFile(__dirname + "/../Data/users.json", function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// Writes to Users File
exports.addUser = async function (obj) {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(__dirname + "/../Data/users.json", obj, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve("User was updated successfully");
      }
    });
  });
};
