module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Spot
    router.post("/", users.create);
    router.post("/login", users.login);
  
    app.use("/api/users", router);
  };
  