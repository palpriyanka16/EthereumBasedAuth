$(document).ready(function(){
    $('#signUpBtn').click(function() {
        $.ajax({
                url: '/signUp',
                method: 'POST',
                data: JSON.stringify({
                    publicAddress: web3.eth.coinbase
                }),
                contentType: 'application/json',
                dataType: 'json',
                success: function (data, status) {
                    alert(data.msg);
                }

            });
    });
    $("#loginBtn").click(function(){
        // code snippet to get nonce and then sign that and get jwt to be added
          
        // });
        $.ajax({
                url: '/getChallenge',
                method: 'POST',
                data: JSON.stringify({
                    publicAddress: web3.eth.coinbase
                }),
                contentType: 'application/json',
                dataType: 'json',
                success: function (data, status) {
                    // alert(status);
                    //console.log(data.nonce);
                    web3.personal.sign(data.nonce, web3.eth.coinbase, (err, signature) => {
                        if (err) console.log(err);
                        else alert(signature);
                          
                    });
                    
                }

            });

    });
});