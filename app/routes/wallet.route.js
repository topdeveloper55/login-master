module.exports = app => {
    const wallets = require("../controllers/wallet.controller.js");
  
    var router = require("express").Router();
  
    //get all wallet address
    router.get("/", wallets.allAddress)

    // Create a new wallet
    router.post("/", wallets.create);

    //Delete all wallets
    router.post("/delete", wallets.deleteAll)
    
    // addNewWallet
    router.post("/addWalletAddress", wallets.addWalletAddress)

    //getAvailable
    router.post("/getAvailable", wallets.getAvailable)

    //receive the request
    router.post("/request", wallets.receiveRequest)

    //get the request list
    router.get("/requestList", wallets.requestList)

    //Agree User request
    router.post("/agreeUser", wallets.agreeUser)

  
    app.use("/api/wallet", router);
  };
  