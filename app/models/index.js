const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.spots = require("./spot.model.js")(mongoose);
db.users = require("./user.model.js")(mongoose);
db.wallets = require("./wallet.model.js")(mongoose);
db.requestUsers = require("./requestUser.model.js")(mongoose);

module.exports = db;
