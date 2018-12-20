var express = require('express');
var router = express.Router();
var path = require('path');
var randomstring = require('randomstring');
var ethUtil = require('ethereumjs-util');
var models  = require(path.join(__dirname, '/../' ,'models'));
var User = models.User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ethereum Login' });
});

router.post('/signUp', function(req, res, next) {
    var nonce = randomstring.generate(12);
    var user = { pubAddr: req.body.publicAddress, nonce: nonce};
    User.sync({force: false}).then(function(){
        User.create(user);
        console.log("User entered into db");
        res.status(200).send(JSON.stringify({msg: "You have been signed up"}));
    });
});

router.post('/getChallenge', function(req, res, next) {
    var pubAddr = req.body.publicAddress;
    User.find({where: {pubAddr: pubAddr}}).then(function(user) {
        res.status(200).send(JSON.stringify({nonce: user.nonce}));
    }).catch(function(err) {
        res.status(404).send(JSON.stringify({msg: "User not found"}));
    })
});

router.post('/auth', function(req, res, next) {
    var pubAddr = req.body.publicAddress;
    var signature = req.body.signature;
    User.findOne({where: {pubAddr: pubAddr}}).then(function(user) {
        var msg = user.nonce;
        const msgBuffer = ethUtil.toBuffer(msg);
        const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
        const signatureBuffer = ethUtil.toBuffer(signature);
        const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
        const publicKey = ethUtil.ecrecover(
          msgHash,
          signatureParams.v,
          signatureParams.r,
          signatureParams.s
        );
        const addressBuffer = ethUtil.publicToAddress(publicKey);
        const address = ethUtil.bufferToHex(addressBuffer);

        // The signature verification is successful if the address found with
        // ecrecover matches the initial publicAddress
        if (address.toLowerCase() === pubAddr.toLowerCase()) {
            console.log("true");
            var newNonce = randomstring.generate(12);
            User.update({
                nonce: newNonce
            }, {
                where: { pubAddr: pubAddr}
            }).then(function(){
                console.log("Nonce updated");
                res.status(200).send(JSON.stringify({msg: "Verified as true"}));
            });
            
        } else {
            console.log("false");
            res.status(501).send(JSON.stringify({msg: "Invalid signature"}));
        }
    });
});

module.exports = router;
