var express = require("express");
var router = express.Router();

const fsUsers = require("../Models/fsUsersDal");

router.get("/", async function (req, res, next) {
  if (!req.session.approved || !req.session.admin) {
    res.redirect("/login");
  } else {
    // GET users listing
    let allUsers = await fsUsers.getUserData();
    res.render("users", { title: "Users Management Page", users: allUsers });
  }
});

// Sending an empty form
router.get("/add", async function (req, res, next) {
  res.render("userdata", {
    title: "User Data Page",
    username: "",
    pwd: "",
    number: "",
    button: "Save",
  });
});

// Sending a full form
router.get("/add/:username", async function (req, res, next) {
  /* Getting users listing. */
  let allUsers = await fsUsers.getUserData();
  let user = allUsers.find((user) => user.username == req.params.username);

  res.render("userdata", {
    title: "User Data Page",
    username: user.username,
    pwd: user.pwd,
    number: user.transactions,
    button: "Update",
  });
});

router.post("/update", async function (req, res, next) {
  let newuser = {
    username: req.body.username,
    pwd: req.body.pwd,
    createdate: new Date(),
    transactions: req.body.transactions,
  };

  // Getting users listing
  let allUsers = await fsUsers.getUserData();

  let isUser = allUsers.find((user) => user.username == req.body.username);

  // If user exists => delete it
  if (isUser) {
    let toDelete = allUsers.find((user) => user.username == req.body.username);

    let index = allUsers.indexOf(toDelete);

    allUsers.splice(index, 1);
  }

  // Adding the new user to the All USers Array
  allUsers.push(newuser);

  let result = await fsUsers.addUser(allUsers);
  res.render("success", { title: "OK", result: result });
});

router.get("/delete/:username", async function (req, res, next) {
  // Getting users listing
  let allUsers = await fsUsers.getUserData();

  // Deleting the user
  let toDelete = allUsers.find((user) => user.username == req.params.username);

  let index = allUsers.indexOf(toDelete);

  allUsers.splice(index, 1);

  let result = await fsUsers.addUser(allUsers);
  res.render("success", { title: "OK", result: result });
});

module.exports = router;
