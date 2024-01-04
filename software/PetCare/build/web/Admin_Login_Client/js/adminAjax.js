function getPetOwners(callback) {
    $.ajax({
        type: 'GET',
        url: '../GetPetOwners',
        data: {},
        success: function(response) {
            let ownersJson = response.split("||")
            ownersJson.pop()  //last element is an empty string
            callback(ownersJson)
        },
        error: function() {
            console.error("Errrorrrr");
        }
    });
}


function getPetKeepers(callback) {
    $.ajax({
        type: 'GET',
        url: '../GetPetKeepers',
        data: {},
        success: function(response) {
            let keepersJson = response.split("||")
            keepersJson.pop()  //last element is an empty string
            callback(keepersJson)
        },
        error: function() {
            console.error("Error getPetKeepers");
        }
    });
}

function deletePetOwnersAjax(userID) {
    
    $.ajax({
        type: 'DELETE',
        url: '../DeletePetOwnerServlet', 
        data: { userID: userID },
        success: function() {
        },
        error: function() {
            console.log("deletePetOwnersAjax error");
        }
    });
}

function deletePetKeepersAjax(userID) {
    
    $.ajax({
        type: 'DELETE',
        url: '../DeletePetKeeperServlet', 
        data: { userID: userID },
        success: function() {
        },
        error: function() {
            console.log("deletePetKeepersAjax error");
        }
    });
}


function getPets(callback) {
    $.ajax({
        type: 'GET',
        url: '../GetPetsServlet',
        data: {},
        success: function(response) {
            let petsJson = response.split("||")
            petsJson.pop()  //last element is an empty string
            callback(petsJson)
        },
        error: function() {
            console.error("Error getPets");
        }
    });
}

function getBookings(callback) {
    $.ajax({
        type: 'GET',
        url: '../BookingsServlet',
        data: {},
        success: function(response) {
            let keepersJson = response.split("||")
            keepersJson.pop()  //last element is an empty string
            callback(keepersJson)
        },
        error: function() {
            console.error("Error getBookings");
        }
    });
}
