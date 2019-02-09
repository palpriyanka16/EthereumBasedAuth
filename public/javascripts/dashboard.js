function logMeOut() {
	alert("Logged out");
	localStorage.removeItem('token');
	return true;
}

function bookRide(button, driverId) {
    console.log(driverId);
    //var myurl = 'http://localhost:8000/bookride/?src_lat='+$("#source-latitude").val()+'&src_lon='+$("#source-longitude").val()+'&dest_lat='+$("#destination-latitude").val()+'&dest_lon='+$("#destination-longitude").val()+'&rider='+localStorage.getItem('username')+'&driverid='+driverId;
    $.ajax({
        // url: myurl,
        url: 'http://localhost:8000/bookride/',
        method: 'POST',
        data: {
            driverid: driverId,
            rider: localStorage.getItem('username'),
            source_latitude: $("#source-latitude").val(),
            destination_latitude: $("#destination-latitude").val(),
            source_longitude: $("#source-longitude").val(),
            destination_longitude: $("#destination-longitude").val(),
            //rideno: 1
        },
        success: function(result) {
            console.log(result);
            var bookingResult = 'You have successfully booked a ride and the booking id is :'+ result.rideno;
            $("#bookingDetails").css("display", "block");
            $("#bookingDetails").html(bookingResult);
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
                <th>Driver Id</th>
                <th>Name</th>
                <th>Street</th>
                <th>Specialisations</th>
                <th>Phone Number</th>
                <th></th>
            </tr>
            `;
            // var driverListHTML = "";
            console.log(data);
            var specOne = '';
            data["driver1"].spec.forEach(function(element) {
                specOne += element + ' '; 
            });
            var specTwo = '';
            data["driver2"].spec.forEach(function(element) {
                specTwo += element + ' '; 
            });
            var specThree = '';
            data["driver3"].spec.forEach(function(element) {
                specThree += element + ' '; 
            });
            var specFour = '';
            data["driver4"].spec.forEach(function(element) {
                specFour += element + ' '; 
            });

            driverListHTML += `
            <tr>
                <td>${data["driver1"].id}</td>
                <td>${data["driver1"].name}</td>
                <td>${data["driver1"].street}</td>
                <td>${specOne}</td>
                <td>${data["driver1"].phone}</td>
                <td><button class="btn btn-success" onclick="bookRide(this, '${data["driver1"].id}')">
                    Book
                </button></td>
            </tr>
            <tr>
                <td>${data["driver2"].id}</td>
                <td>${data["driver2"].name}</td>
                <td>${data["driver2"].street}</td>
                <td>${specTwo}</td>
                <td>${data["driver2"].phone}</td>
                <td><button class="btn btn-success" onclick="bookRide(this, '${data["driver2"].id}')">
                    Book
                </button></td>
            </tr>
            <tr>
                <td>${data["driver3"].id}</td>
                <td>${data["driver3"].name}</td>
                <td>${data["driver3"].street}</td>
                <td>${specThree}</td>
                <td>${data["driver3"].phone}</td>
                <td><button class="btn btn-success" onclick="bookRide(this, '${data["driver3"].id}')">
                    Book
                </button></td>
            </tr>
            <tr>
                <td>${data["driver4"].id}</td>
                <td>${data["driver4"].name}</td>
                <td>${data["driver4"].street}</td>
                <td>${specFour}</td>
                <td>${data["driver4"].phone}</td>
                <td><button class="btn btn-success" onclick="bookRide(this, '${data["driver4"].id}')">
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
