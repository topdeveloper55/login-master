const jwtEncode = require('jwt-encode')
const db = require("../models");
const User = db.users;
const secret = 'secret';


// Create and Save a new user
exports.create = async (req, res) => {
    User.find({})
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });
  User.find({ email: req.body.email })
    .then((data) => {
      if (data.length === 0) {
        const user = new User({
          id: req.body.id,
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          password: req.body.password,
        });
        user.save(user);
      } else return;
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });

  //   const user = new User({
  //     // walletAddress: req.body.data.walletAddress,
  //     id: req.body.id,
  //     email: req.body.email,
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     password: req.body.password,
  //   });
  //   user.save(user)
};

exports.login = async (req, res) => {
  const iat = req.body.time
  const exp = req.body.time + 600

  User.find({ email: req.body.email })
    .then((data) => {
      if (data.length === 0) {
        res.send('There is no user')
      } else if(data[0].password !== req.body.password){
        res.send('Wrong Password')
      }
       else {
        const userId = data[0].id
        const serviceToken = jwtEncode({
          userId: userId,
          iat: iat,
          exp: exp
        }, secret)
        console.log(data)
        const user = {
          email: data[0].email,
          id: data[0]._id,
          name:`${data[0].firstName} ${data[0].lastName}`
        }
        const response = {
          serviceToken:serviceToken,
          user:user
        }
        res.send(response)
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving spots.",
      });
    });

};
