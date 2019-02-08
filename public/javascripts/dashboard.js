function logMeOut() {
	alert("Logged out");
	localStorage.removeItem('token');
	return true;
}

function bookRide(button, driverName) {
    console.log(driverName);
    $.ajax({
        url: 'http://localhost:8000/bookride/',
        method: 'POST',
        data: {
            driver: driverName,
            rider: localStorage.getItem('username'),
            source_latitude: $("#source-latitude").val(),
            destination_latitude: $("#destination-latitude").val(),
            source_longitude: $("#source-longitude").val(),
            destination_longitude: $("#destination-longitude").val(),
            rideno: 1
        },
        success: function(result) {
            console.log(result);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function displayRiders() { 

	$.ajax({
        url: 'http://localhost:8000/list',
        method: 'GET',
        // data: JSON.stringify(data),
        contentType: 'application/json',
        // dataType: 'json',
        success: function (data, status) {
            console.log(data);
            var driverListHTML = `
            <tr>
                <th>Name</th>
                <th>Contact</th>
            </tr>
            `;
            // var driverListHTML = "";
            data.forEach(function(driver) {
                driverListHTML += `
                <tr>
                    <td>${driver.name}</td>
                    <td>${driver.phone}</td>
                    <td><button onclick="bookRide(this, '${driver.name}')">
                        Book
                    </button></td>
                </tr>
                `;
            });
            $("#driverDetails").html(driverListHTML);
        },
    }).fail(function($xhr) {
        console.log($xhr);
        // $("#signUpFormLogMessage").html($xhr.responseText);
    });
}

function suggestRiders() {
    var features = new Array()
    $("input:checkbox[name=feature]:checked").each(function(){
    features.push($(this).val());
    });
    var myurl = 'http://localhost:8000/suggest/?lat='+$("#source-latitude").val()+'&lon='+$("#source-longitude").val()+'&spec='+features[0];
    for(i = 1;i<features.length;i++)
    {
        myurl+=','+features[i];
    }
    console.log(myurl);
    $.ajax({
        url: myurl,
        method: 'GET',
        contentType: 'application/json',
        success: function (data, status) {
            console.log(data);
            var driverListHTML = `
            <tr>
                <th>Ride Number</th>
                <th>Name</th>
                <th>Contact</th>
            </tr>
            `;
            // var driverListHTML = "";
            console.log(data);
            driverListHTML += `
            <tr>
                <td>${data["driver1"].name}</td>
                <td>${data["driver1"].phone}</td>
                <td><button onclick="bookRide(this, '${data["driver1"].name}')">
                    Book
                </button></td>
            </tr>
            `;
            $("#driverDetails").html(driverListHTML);
            
        }            
    }).fail(function($xhr) {
        console.log($xhr);
        // $("#signUpFormLogMessage").html($xhr.responseText);
    });
}
