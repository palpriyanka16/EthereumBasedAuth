var express = require('express');
var router = express.Router();
var path = require('path');
var randomstring = require('randomstring');
var ethUtil = require('ethereumjs-util');
var jwt = require('jsonwebtoken');
var secretString = "nerHhpVNs2CA";
var models  = require(path.join(__dirname, '/../' ,'models'));
var User = models.User;
var passwordHash = require('password-hash');

var loggedIn = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  if(loggedIn) res.render('dashboard');
  res.render('index', { title: 'Ethereum Login' });
});

router.post('/signUp', function(req, res, next) {
    var user = {
        username: req.body.username,
    }

    if (req.body.isMetamaskSignUp) {
        user['pubAddr'] = req.body.publicAddress;
        user['nonce'] = randomstring.generate(12);
    } else {
        user['hashedPassword'] = passwordHash.generate(req.body.password);
    }

    User.sync({force: false}).then(function(){
        User.create(user)
        .then(user => {
            console.log(user.username + " entered into db");
            res.status(200).send(JSON.stringify({msg: "You have been signed up"}));
        })
        .catch(err => {
            if (err.name === 'SequelizeUniqueConstraintError') {
                res.status(500).send('username or metamask publicAddress already exists.');
            } else {
                res.status(500).send('Internal server error.');
            }
        });
    }).catch(function(err) {
        console.log(err);
        res.status(500).send('Internal server error.');
    });
});

router.get('/getChallenge', function(req, res, next) {
    loggedIn = false;
    console.log(pubAddr);
    var pubAddr = req.query.publicAddress;
    User.find({where: {pubAddr: pubAddr}}).then(function(user) {
        res.status(200).send(JSON.stringify({nonce: user.nonce}));
    }).catch(function(err) {
        res.status(404).send(JSON.stringify({msg: "User not found"}));
    })
});

router.post('/auth', function(req, res, next) {
    loggedIn = false;
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
                const payload = {
                    user: user.pubAddr    
                };
                var token = jwt.sign(payload, secretString, {
                    expiresIn: 86400  
                });
                //console.log(token);
                res.status(200).send(JSON.stringify({msg: "Verified as true", token: token}));
            });
            
        } else {
            console.log("false");
            res.status(501).send(JSON.stringify({msg: "Invalid signature"}));
        }
    });
});

router.get('/restrictedAccess', function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
       loggedIn = false;
       return res.status(401).send({ auth: false, message: 'No token provided.' }); 
    } 
    console.log(token);
    jwt.verify(token, secretString, function(err, decoded) {
        if (err){
           loggedIn = false;
           return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' }); 
        } 
        console.log("Verified");
        loggedIn = true;
        res.status(200).send(JSON.stringify({msg : "Holla you are logged in"}));
    });
});

router.get('/displayDashboard', function(req, res, next) {
    if(loggedIn)
        res.render('dashboard');
    else res.render('error', {message: 'You need to login to access'});
});

router.post('/logout', function(req, res, next) {
    loggedIn = false;
    res.render('index', {title: 'Ethereum Login'});
});
module.exports = router;
