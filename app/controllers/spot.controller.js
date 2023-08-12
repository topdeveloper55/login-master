const db = require("../models");
const Spot = db.spots;

// Create and Save a new spot
exports.create = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  let date_ob = new Date().toISOString().split("T")[0];
  const equSpots = await Spot.find({
    walletAddress: req.body.data.walletAddress,
    date: date_ob,
    winStatus: req.body.winStatus,
  });
  if (equSpots.length !== 4) {
    const spot = new Spot({
      walletAddress: req.body.data.walletAddress,
      winStatus: req.body.data.winStatus,
      date: date_ob,
      published: req.body.published ? req.body.published : false,
      remainTimes: req.body.data.remainTimes,
      nickName: req.body.data.nickName,
    });
    spot
      .save(spot)
      .then((data) => {
        res.send("success");
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Spots.",
        });
      });
  } else if (equSpots.length === 4) {
    res.send("There are no more chances today");
  }
};

// Retrieve all Spots from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title
    ? { title: { $regex: new RegExp(title), $options: "i" } }
    : {};

  Spot.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

exports.remainTimes = async (req, res) => {
  // const date = date_ob.split("T");
  const lastRecord = await Spot.find({
    walletAddress: req.body.data.walletAddress,
  })
    .sort({ $natural: -1 })
    .limit(1);

  const winValue = await Spot.find({
    walletAddress: req.body.data.walletAddress,
    winStatus: 1,
  });
  let winPossible;
  if (winValue.length === 0) winPossible = "possible";
  else winPossible = "impossible";

  if (lastRecord.length === 0) {
    const response = {
      remainTimes: 4,
      winPossible: winPossible,
    };
    res.send(response);
  } else if (lastRecord.length >= 0) {
    if (lastRecord[0].remainTimes !== 0) {
      const response = {
        remainTimes: lastRecord[0].remainTimes,
        winPossible: winPossible,
        createdAt: lastRecord[0].createdAt,
      };
      res.send(response);
    } else if (lastRecord[0].remainTimes === 0) {
      const remainSecond = differentTime(lastRecord[0].createdAt);
      if (remainSecond >= 14400) {
        const response = {
          remainTimes: 4,
          winPossible: winPossible,
          createdAt: lastRecord[0].createdAt,
        };
        res.send(response);
      } else if (remainSecond < 14400) {
        const response = {
          remainTimes: 0,
          winPossible: winPossible,
          createdAt: lastRecord[0].createdAt,
        };
        res.send(response);
      }
    }
  }
};
// Find a single Spot with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Spot.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Spot with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving Spot with id=" + id });
    });
};

// Update a Spot by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Spot.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Spot with id=${id}. Maybe Spot was not found!`,
        });
      } else res.send({ message: "Spot was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Spot with id=" + id,
      });
    });
};

// Delete a Spot with the specified id in the request
exports.delete = (req, res) => {
  const id = req.body.id;
  Spot.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Spot with id=${id}. Maybe Spot was not found!`,
        });
      } else {
        res.send({
          message: "Spot was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Spot with id=" + id,
      });
    });
};

// Delete all Spots from the database.
exports.deleteAll = (req, res) => {
  Spot.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Spots were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all spots.",
      });
    });
};

exports.allData = (req, res) => {
  Spot.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

// Find all published Spots
exports.findAllPublished = (req, res) => {
  Spot.find({ published: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

exports.playersNumber = (req, res) => {
  let allUsers;
  let dailyUsers;
  let date_ob = new Date().toISOString().split("T")[0];
  Spot.find({})
    .then((data) => {
      let players = [data[0]];
      for (let i = 0; i < data.length; i++) {
        let k = 0;
        for (let j = 0; j < players.length; j++) {
          if (data[i].walletAddress === players[j].walletAddress) k = k + 1;
        }
        if (k === 0) players.push(data[i]);
      }
      allUsers = players.length;
      Spot.find({ date: date_ob })
        .then((data) => {
          let players = [data[0]];
          for (let i = 0; i < data.length; i++) {
            let k = 0;
            for (let j = 0; j < players.length; j++) {
              if (data[i].walletAddress === players[j].walletAddress) k = k + 1;
            }
            if (k === 0) players.push(data[i]);
          }
          dailyUsers = players.length;
          const response = {
            allUsers: allUsers,
            dailyUsers: dailyUsers
          }
          res.send(response)
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving spots.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

exports.winners = (req, res) => {
  Spot.find({ winStatus: 1 })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

function differentTime(create) {
  let date1 = new Date(create);
  let date2 = new Date();
  var dif = Math.round(date2 - date1) / 1000;
  return dif;
}
