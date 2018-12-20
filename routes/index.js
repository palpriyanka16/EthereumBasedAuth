var express = require('express');
var router = express.Router();
var path = require('path');
var models  = require(path.join(__dirname, '/../' ,'models'));
var User = models.User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ethereum Login' });
});

router.post('/signUp', function(req, res, next) {
    var user = { pubAddr: req.body.publicAddress};
    User.sync({force: false}).then(function(){
        User.create(user);
        console.log("User entered into db");
        res.status(200).send(JSON.stringify({msg: "You have been signed up"}));
    });
});

module.exports = router;
