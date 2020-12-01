var express = require("express");
var router = express.Router();

const fsUsers = require("../Models/fsUsersDal");

let date = new Date();
let today = date.toLocaleDateString();

// Menu page
router.get("/", function (req, res, next) {
  if (!req.session.date || req.session.date != today) {
    req.session.approved = false;
    req.session.admin = false;
  }

  res.render("login", { title: "Login Page" });
});

router.post("/", async function (req, res, next) {
  // Getting details from file
  let fsUsersData = await fsUsers.getUserData();

  // Saving admin
  let admin = fsUsersData[0];

  // Checking Credentials
  let filteredUser = fsUsersData.filter(
    (item) => item.username == req.body.username && item.pwd == req.body.pwd
  )[0];

  if (!filteredUser) {
    req.session.approved = false;
    req.session.admin = false;
    res.send("YOU ARE NOT AUTHOURIZED");
  } else if (filteredUser == admin) {
    req.session.approved = true;
    req.session.admin = true;
    req.session.transactions = filteredUser.transactions;
    res.render("menu", {
      title: "Admin Menu",
      data: "User Management",
      number: req.session.transactions,
      count: "",
    });
  } else {
    // Login by regular user
    if (!req.session.approved) {
      req.session.approved = true;
      req.session.transactions = filteredUser.transactions;
      if (req.session.transactions <= 0) {
        res.send("You have exceeded your transactions limit for today");
      }
    }

    res.render("menu", {
      title: "Menu",
      data: "",
      number: req.session.transactions,
    });
  }
});

module.exports = router;
