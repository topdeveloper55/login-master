module.exports = app => {
  const spots = require("../controllers/spot.controller.js");

  var router = require("express").Router();

  // Create a new Spot
  router.post("/", spots.create);

  // Retrieve remain Spots times
  router.post("/remainTimes", spots.remainTimes);

  // Delete spot
  router.post("/deleteById", spots.delete);

  // Retrieve all Spots 
  router.get("/all", spots.allData);

  router.get("/winners", spots.winners);

  // Retrieve all published Spots
  router.get("/published", spots.findAllPublished);

  // Retrieve a single Spot with id
  router.get("/:id", spots.findOne);

  // Update a Spot with id
  router.put("/:id", spots.update);

  router.post("/playersNumber", spots.playersNumber);


  // Create a new Spot
  router.delete("/", spots.deleteAll);

  app.use("/api/spots", router);
};
