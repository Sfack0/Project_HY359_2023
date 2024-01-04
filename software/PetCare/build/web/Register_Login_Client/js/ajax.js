
// function getPetUser() {
//     var data = $('#registration-form :input:not("#confirm-password")').serialize();
//     $.ajax({
//         type: 'GET',
//         url: 'GetPetOwner',
//         data: data,
//         success: function(response) {
//             console.log(response);
//             console.log("Successful Login 11");
//             // Handle successful response here
//         },
//         error: function(xhr, status, error) {
//             console.error("Error: User does not exist or incorrect password" + error);
//             $("#ajaxContent").html("User does not exist or incorrect password");
//             // Handle error response here
//         }
//     });
// }


function addPetUser(latlon) {
    lat = latlon[0];    
    lon = latlon[1];
    var data = $('#registration-form :input:not("#confirm-password")').serialize();
    data += '&lat=' + lat + '&lon=' + lon;
    if($('input[name="user-type"]:checked').val() === 'pet-owner'){
        $.ajax({
            type: 'Post',
            url: 'AddPetOwnerServlet',
            data: data,
            success: function(response) {

                login($('#username').val(), $('#password').val())
            },
            error: function(xhr, status, error) {

            }
        });
    }else{
        $.ajax({
            type: 'Post',
            url: 'AddPetKeeperServlet',
            data: data,
            success: function(response) {

                login($('#username').val(), $('#password').val())
            },
            error: function(xhr, status, error) {
                
            }
        });
    }
}


function checkUsernamesFromDatabase(callback) {
    let username = $("#username").val();
    $.ajax({
        type: 'GET',
        url: 'CheckUsernameServlet',
        data: { username: username },
        success: function() {
            callback(true);
        },
        error: function() {
            console.error("Username already exists in database");
            callback(false);
        }
    });
}


function checkEmailsFromDatabase(callback) {
    let email = $("#email").val();
    
    $.ajax({
        type: 'GET',
        url: 'CheckEmailServlet', 
        data: { email: email },
        success: function() {
            callback(true);
        },
        error: function() {
            console.error("Email already exists in database");
            callback(false);
        }
    });
}

function tryToLogin(username, password, callback){
    $.ajax({
        type: 'GET',
        url: 'LoginServlet', 
        data: { username: username, password: password },
        success: function(response) {
            callback(true, response);
        },
        error: function() {
            callback(false);
        }
    });


}


function changeValue(field, value, user, userType){
    $.ajax({
        type: 'POST',
        url: '../ChangeValueServlet', 
        data: { field: field, value: value, user: user, userType: userType },
        success: function(response) {
            
        },
        error: function(response) {
            console.error("Value change error");
        }
    });


}
