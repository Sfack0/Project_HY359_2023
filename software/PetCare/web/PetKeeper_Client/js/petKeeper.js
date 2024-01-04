
function loadMyBookings(){
    getBookings(function(bookingJson){
        let bookings = [];
        bookings.push(...bookingJson.map(jsonString => JSON.parse(jsonString)));
        user = JSON.parse(getCookie('user'));

        bookings = bookings.filter(booking => booking.keeper_id == user.keeper_id);

        getPets(function(petsJson){
            let petsMap = {};  //maps pet_id to pet

            petsJson.forEach(petJson => {
                let pet = JSON.parse(petJson);
                petsMap[pet.pet_id] = pet;
            });

            getPetOwners(function (petOwnersJson) {
            
                let ownersMap = {};  //maps keeper_id to keeper

                petOwnersJson.forEach(ownerJson => {
                    let owner = JSON.parse(ownerJson);
                    ownersMap[owner.owner_id] = owner;
                });

           
                for(const booking of bookings){
                        $('.myBookings').html($('.myBookings').html() + addBookingToHtml(booking, ownersMap, petsMap));
                }
    
            });
        });        
    });
}



function addBookingToHtml(booking, ownersMap, petsMap){
    let buttonsHtml = ''; 

    if (booking.status === 'requested') {
        buttonsHtml = `
            <button class="accept-button" onclick= 'updateStatus(${booking.booking_id}, "accepted")'>Accept</button>
            <button class="reject-button" onclick= 'updateStatus(${booking.booking_id}, "rejected")'>Reject</button>
        `;
    }else if (booking.status === 'accepted') {
        buttonsHtml = `
            <button class="send-message-button" onclick= 'showMessages(${JSON.stringify(booking)}, ${JSON.stringify(ownersMap)})'>Send Message</button>
        `;
    }

    return  `
        <div class="booking ${booking.status}-color">
            <p class="booking-info">@${ownersMap[booking.owner_id].username}</p>
            <button class="extra-info">i</button>
            <div class="extra-info-owner">
                <p>Name: ${ownersMap[booking.owner_id].firstname} ${ownersMap[booking.owner_id].lastname}</p>
                <p>Email: ${ownersMap[booking.owner_id].email}</p>
                <p>Telephone: ${ownersMap[booking.owner_id].telephone}</p>
            </div>
            <p class="booking-info">${petsMap[booking.pet_id].type}</p>
            <button class="extra-info">i</button>
            <div class="extra-info-pet">
                <p>Name: ${petsMap[booking.pet_id].name}</p>
                <p>Breed: ${petsMap[booking.pet_id].breed}</p>
                <p>Gender: ${petsMap[booking.pet_id].gender}</p>
            </div>
            <p class="booking-info">${booking.fromdate}</p>
            <p class="booking-info">${booking.todate}</p>
            <p class="booking-info">${booking.status}</p>
            <p class="booking-info">${booking.price}$</p>
            ${buttonsHtml} 
        </div>
    `
}

function closeMessages(){
    $('.messages-container').css('display', 'none');
    $('.close-messages').css('display', 'none');
    $('.new-message-input').css('display', 'none');
}

function showMessages(booking, ownersMap){
    $('.messages-container').css('display', 'flex');
    $('.close-messages').css('display', 'flex');
    $('.new-message-input').css('display', 'flex');

    bookingMessages = booking;

    user = JSON.parse(getCookie('user'));

    getMessages(booking.booking_id, function(messagesJson){
        let messages = [];
        messages.push(...messagesJson.map(jsonString => JSON.parse(jsonString)));
        $('.messages-container').html("");
        for(let message of messages){
            let senderSide;
            let messageSide;
            if(message.sender === 'owner'){
                senderSide = 'left-sender-message';
                messageSide = 'left-message';
            }else{
                senderSide = 'right-sender-message';
                messageSide = 'right-message';
            }
            if(senderSide === 'left-sender-message'){
                $('.messages-container').html( $('.messages-container').html() + 
                ` <div class=${senderSide}>
                    <div class="message-sender">@${ownersMap[booking.owner_id].username}</div>
                    <div class="message ${messageSide}">
                        ${message.message}
                    </div>
                </div>`);
            }else{
                $('.messages-container').html( $('.messages-container').html() + 
                ` <div class=${senderSide}>
                    <div class="message ${messageSide}">
                        ${message.message}
                    </div>
                    <div class="message-sender">@${user.username}</div>
                </div>`);
            }
            
        }
        
    });
}

function sendMessage(){
    messageObj = {};
    messageObj.booking_id = bookingMessages.booking_id;
    messageObj.message = $('#newMessageInput').val();
    messageObj.sender = 'keeper';
    const currentDate = new Date();
    const formattedDateTime = `${currentDate.getFullYear()}-${padZero(currentDate.getMonth() + 1)}-${padZero(currentDate.getDate())} ${padZero(currentDate.getHours())}:${padZero(currentDate.getMinutes())}:${padZero(currentDate.getSeconds())}`;
    messageObj.datetime = formattedDateTime;

    addMessage(messageObj);

    
    getPetOwners(function (petOwnersJson) {
            
        let ownersMap = {};  //maps keeper_id to keeper

        petOwnersJson.forEach(ownerJson => {
            let owner = JSON.parse(ownerJson);
            ownersMap[owner.owner_id] = owner;
        });

        showMessages(bookingMessages, ownersMap);

    });
}

function padZero(num) {
    return num < 10 ? `0${num}` : num;
}


function updateStatus(booking_id, status) {
    $.ajax({
        type: 'PUT',
        url: '../BookingsServlet',
        data: {booking_id: booking_id, status: status},
        success: function(response) {               //reseting bookings
            $('.myBookings').html(`<div class="booking-header">
                    <p class="booking-info ">Pet Owner</p>
                    <p class="empty-space"></p>
                    <p class="booking-info pet-info">Pet</p>
                    <p class="empty-space"></p>
                    <p class="booking-info">From Date</p>
                    <p class="booking-info">To Date</p>
                    <p class="booking-info">Status</p>
                    <p class="booking-info">Total Price</p>
                    <p></p>
                    <p></p>
                </div>`);
            loadMyBookings();
        },
        error: function() {
            console.error("Error updateStatus");
        }
    });
}

function addMessage(message) {
    $.ajax({
        type: 'POST',
        url: '../MessagesServlet',
        data: message,
        success: function(response) {

        },
        error: function() {
            console.error("Error addMessage");
        }
    });
}


function getMessages(booking_id, callback) {
    $.ajax({
        type: 'GET',
        url: '../MessagesServlet',
        data: {booking_id: booking_id},
        success: function(response) {
            let messagesJson = response.split("||")
            messagesJson.pop()  //last element is an empty string
            callback(messagesJson)
        },
        error: function() {
            console.error("Error getMessages");
        }
    });
}

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
            console.error("Error getPetOwners");
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
            callback(petsJson);
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

function getReviews(keeper_id, callback) {
    $.ajax({
        type: 'GET',
        url: '../ReviewsServlet',
        data: {keeper_id: keeper_id},
        success: function(response) {
            let reviewsJson = response.split("||")
            reviewsJson.pop()  //last element is an empty string
            callback(reviewsJson)
        },
        error: function() {
            console.error("Error getBookings");
        }
    });
}


function loadMyReviews(){
    user = JSON.parse(getCookie('user'));

    getReviews(user.keeper_id, function(reviewsJson){
        let reviews = [];
        reviews.push(...reviewsJson.map(jsonString => JSON.parse(jsonString)));


        for(let review of reviews){
            getPetOwners(function (petOwnersJson) {
            
                let ownersMap = {};  //maps keeper_id to keeper

                petOwnersJson.forEach(ownerJson => {
                    let owner = JSON.parse(ownerJson);
                    ownersMap[owner.owner_id] = owner;
                });

                $('.myReviews').html( $('.myReviews').html() + `<div class="review-container" data-score='${review.reviewScore}'>
                    <h4>${ownersMap[review.owner_id].username}</h4>
                    <p class="review">${review.reviewText}</p>
                    <p class="score"></p>
                </div>`);
            });
        }

        
    });
}