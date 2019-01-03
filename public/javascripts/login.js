$(document).ready(function(){
    
    // Sign up form submit handler.
    $('#signUpForm').submit(function(event) {
        event.preventDefault();

        var data = {};
        data['username'] = $("#signUpForm").find('input[name="username"]').val();
        data['isMetamaskSignUp'] = $("#signUpForm").find('input[name="isMetamaskSignUp"]').is(':checked');
        // If the checkbox is set, then user wants to sign up via metamask.
        if (data['isMetamaskSignUp']) {
            // if the user is not logged into metamask or if the user does not have meta mask, the form submit fails.
            if (web3.eth.coinbase) {
                data['publicAddress'] = web3.eth.coinbase;
            } else {
                $('#signUpFormLogMessage').html('Login into MetaMask to sign up using it...');
                return;
            }
        }
        // else use the password feild for traditional sign up using username and password
        else {
            data['password'] = $("#signUpForm").find('input[name="password"]').val();
        }

        $.ajax({
            url: '/signUp',
            method: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            success: function (data, status) {
                $("#signUpFormLogMessage").html(data.msg);
            },
        }).fail(function($xhr) {
            $("#signUpFormLogMessage").html($xhr.responseText);
        });
    });

    $('#loginForm').submit(function(event) {
        event.preventDefault();

        var data = {
            'username': $("#loginForm").find('input[name="username"]').val(),
            'password': $("#loginForm").find('input[name="password"]').val(),
            'isMetamask': false,
        };
        authenticate(data);
    });

    $('#signUpFormMetamaskCheckBox').change(function() {
        $('#signUpFormPasswordInput').attr('disabled', this.checked);
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
                            var data = {
                                'publicAddress': web3.eth.coinbase,
                                'signature': signature,
                                'isMetamask': true,
                            };
                            authenticate(data);
                        }
                          
                    });
                    
                }

            });

    });
});

function authenticate(data) {
    // alert(signature);
    $.ajax({
        url: '/auth',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data, status) {
            //alert("Signature verified" + " " + data.token);
            localStorage.setItem('token', data.token);
            getDashboard();
        },
    }).fail(function($xhr) {
        $("#loginFormLogMessage").html($xhr.responseText);
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
