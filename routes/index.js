var express = require('express');
var router = express.Router();
var path = require('path');
var randomstring = require('randomstring');
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

module.exports = router;
