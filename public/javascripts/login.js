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
        // here first the code snippet to get the nonce and then sign and get jwt has to be incorporated
        // for now i have just tried signing a random message only to see if metamask works properly
        web3.personal.sign(web3.fromUtf8("Hello"), web3.eth.coinbase, (err, signature) => {
          if (err) console.log(err);
          else alert(signature);
          
        });
    });
});