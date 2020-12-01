var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  if (!req.session.approved) {
    res.redirect("/login");
  } else {
    if (!req.session.admin) {
      if (req.session.transactions <= 0) {
        res.send("You have exceeded your transactions limit for today");
      } else {
        res.render("menu", {
          title: "Menu",
          data: "",
          number: req.session.transactions,
        });
      }
    } else {
      res.render("menu", {
        title: "Admin Menu",
        data: "User Management",
        number: req.session.transactions,
      });
    }
  }
});

router.post("/getoption", function (req, res, next) {
  if (req.body.actions == "Create New Movie") {
    res.redirect("/create");
  } else if (req.body.actions == "Search A Movie") {
    res.redirect("/search");
  } else {
    res.redirect("/users");
  }
});

module.exports = router;
