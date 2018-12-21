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
        $.ajax({
                url: '/getChallenge',
                method: 'GET',
                data: {
                    publicAddress: web3.eth.coinbase
                },
                contentType: 'application/json',
                dataType: 'json',
                success: function (data, status) {
                    // alert(status);
                    //console.log(data.nonce);
                    web3.personal.sign(data.nonce, web3.eth.coinbase, (err, signature) => {
                        if (err) console.log(err);
                        else {
                            authenticate(signature);
                        }
                          
                    });
                    
                }

            });

    });
});

function authenticate(signature) {
    // alert(signature);
    $.ajax({
        url: '/auth',
        method: 'POST',
        data: JSON.stringify({
            publicAddress: web3.eth.coinbase,
            signature: signature
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data, status) {
            //alert("Signature verified" + " " + data.token);
            localStorage.setItem('token', data.token);
            getDashboard();
        },
        error: function (status, error) {
           alert("Invalid signature");
        }

    });
}

function getDashboard() {
    $.ajax({
        url: '/restrictedAccess',
        method: 'GET',
        headers: {"x-access-token": localStorage.getItem('token')},
        contentType: 'application/json',
        dataType: 'json',
        success: function (data, status) {
            //alert(data.msg);
            window.location.href = "/displayDashboard";
        },
        error: function(status, error) {
            alert("Some error happened");
        }

    });

}
