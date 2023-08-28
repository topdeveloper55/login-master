const db = require("../models");
const ethers = require("ethers");
const Spin = db.spins;

// Create and Save a new user
exports.deposit = async (req, res) => {
  const walletAddress = req.body.data.walletAddress;
  const amount = req.body.data.amount;
  Spin.find({ walletAddress: walletAddress })
    .then((data) => {
      if (data.length === 0) {
        const spin = new Spin({
          walletAddress: walletAddress,
          balance: amount,
          bonus: 0
        });
        spin
          .save(spin)
          .then((data) => {
            res.send(data.balance.toString());
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Spots.",
            });
          });
      } else if (data.length !== 0) {
        const newSpin = {
          walletAddress: walletAddress,
          balance: data[0].balance + parseFloat(amount),
          bonus: data[0].bonus
        };
        Spin.findOneAndUpdate({ walletAddress: walletAddress }, newSpin, {
          useFindAndModify: false,
        })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update Spot with  Maybe Spot was not found!`,
              });
            } else res.send(newSpin.balance.toString());
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating Spot with id=",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

exports.getBalence = async (req, res) => {
  const walletAddress = req.body.data.walletAddress;
  Spin.find({ walletAddress: walletAddress })
    .then((data) => {
      if (data.length === 0) {
        res.send("unexist");
      } else if (data.length !== 0) res.send(data[0].balance.toString());
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Spot with id=",
      });
    });
};

exports.withdraw = async (req, res) => {
  const walletAddress = req.body.data.walletAddress;
  const amount = req.body.data.amount;
  const usdAmount = req.body.data.usdAmount;
  Spin.find({ walletAddress: walletAddress })
    .then((data) => {
      if (data.length === 0) {
        res.send("unexist");
      } else if (data.length !== 0) {
        let network = "sepolia";
        let provider = ethers.getDefaultProvider(network);
        let privateKey =
          "6bb2e2318f27802213a3a5b752fea8aa8cd219def398738bcb60eba923cd8ba6";
        let wallet = new ethers.Wallet(privateKey, provider);
        let receiverAddress = walletAddress;
        const value = ethers.utils.parseEther(amount.toString());
        let tx = {
          to: receiverAddress,
          value: value,
        };
        wallet
          .sendTransaction(tx)
          .then((txObj) => {
            console.log("txHash", txObj.hash);
            const newSpin = {
              walletAddress: walletAddress,
              balance: data[0].balance - parseFloat(usdAmount),
              bonus: data[0].bonus
            };
            Spin.findOneAndUpdate({ walletAddress: walletAddress }, newSpin, {
              useFindAndModify: false,
            })
              .then((data) => {
                if (!data) {
                  res.status(404).send({
                    message: `Cannot update Spot with. Maybe Spot was not found!`,
                  });
                } else res.send(newSpin.balance.toString());
              })
              .catch((err) => {
                res.status(500).send({
                  message: "Error updating Spot with id=",
                });
              });
          })
          .catch((err) => {
            console.log("------->", err);
            res.send("error");
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Spot with id=",
      });
    });
};

exports.win = async (req, res) => {
  const walletAddress = req.body.data.walletAddress;
  const amount = req.body.data.amount;
  Spin.find({ walletAddress: walletAddress })
    .then((data) => {
      if (data.length === 0) {
        const spin = new Spin({
          walletAddress: walletAddress,
          balance: amount,
        });
        spin
          .save(spin)
          .then((data) => {
            res.send(data.balance.toString());
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Spots.",
            });
          });
      } else if (data.length !== 0) {
        const newSpin = {
          walletAddress: walletAddress,
          balance: data[0].balance + parseFloat(amount),
          bonus: data[0].bonus
        };
        Spin.findOneAndUpdate({ walletAddress: walletAddress }, newSpin, {
          useFindAndModify: false,
        })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update Spot with  Maybe Spot was not found!`,
              });
            } else res.send(newSpin.balance.toString());
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating Spot with id=",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

exports.betStart = async (req, res) => {
  const walletAddress = req.body.data.walletAddress;
  const amount = req.body.data.amount;
  Spin.find({ walletAddress: walletAddress })
    .then((data) => {
      if (data.length === 0) {
        const spin = new Spin({
          walletAddress: walletAddress,
          balance: amount,
        });
        spin
          .save(spin)
          .then((data) => {
            res.send(data.balance.toString());
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Spots.",
            });
          });
      } else if (data.length !== 0) {
        const newSpin = {
          walletAddress: walletAddress,
          balance: data[0].balance - parseFloat(amount),
          bonus: data[0].bonus
        };
        Spin.findOneAndUpdate({ walletAddress: walletAddress }, newSpin, {
          useFindAndModify: false,
        })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update Spot with  Maybe Spot was not found!`,
              });
            } else res.send(newSpin.balance.toString());
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating Spot with id=",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
};

exports.bonusBuy = async (req, res) => {
  const walletAddress = req.body.data.walletAddress;
  const amount = req.body.data.amount;
  console.log("req.body.data----->", req.body.data)
  Spin.find({ walletAddress: walletAddress })
    .then((data) => {
      if (data.length === 0) {
        res.send("unexist");
      } else if (data.length !== 0) {
        const newSpin = {
          walletAddress: walletAddress,
          balance: data[0].balance - parseFloat(amount),
          bonus: data[0].bonus + 1
        };
        Spin.findOneAndUpdate({ walletAddress: walletAddress }, newSpin, {
          useFindAndModify: false,
        })
          .then((data) => {
            if (!data) {
              res.status(404).send({
                message: `Cannot update Spot with. Maybe Spot was not found!`,
              });
            } else res.send(newSpin);
          })
          .catch((err) => {
            res.status(500).send({
              message: "Error updating Spot with id=",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Spot with id=",
      });
    });
};
