function createTableFromJSON(data,i) {
	var html = "<h4>Laptop "+i+"</h4><table><tr><th>Category</th><th>Value</th></tr>";
    for (const x in data) {
        var category=x;
        var value=data[x];
        html += "<tr><td>" + category + "</td><td>" + value + "</td></tr>";
    }
    html += "</table><br>";
    return html;

}

function displayWarning(targetElement, message) {
    $(".warnings").remove();
    $(".successes").remove();

    var warning = $("<div>").addClass("warnings").text(message);
    $(targetElement).after(warning);
  }
  

  function displaySuccess(targetElement, message) {
    $(".warnings").remove();
    $(".successes").remove();

    var success = $("<div>").addClass("successes").text(message);
    $(targetElement).after(success);
  }
  

function addPet() {
    let myForm = document.getElementById('addPetForm');
    let formData = new FormData(myForm);
    
    const data = {};
    data['owner_id'] = JSON.parse(getCookie('user')).owner_id;
    formData.forEach((value, key) => {
        data[key] = value;

    });
   
    var jsonData=JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            displaySuccess($('.button'), JSON.parse(xhr.responseText).message)            
        } else if (xhr.status !== 200) {
            displayWarning($('.button'), JSON.parse(xhr.responseText).message)
        }
    };
    xhr.open('POST', 'http://localhost:4567/petcare/pet');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}


function getPetInfo(){
    getPets(function(petsJson){
        let pets = [];
        for (let pet of petsJson) {
          pets.push(JSON.parse(pet));
        }

        user = JSON.parse(getCookie('user'));

        let petOfOwner;
        pets.forEach(pet => {
            if(parseInt(pet.owner_id) === user.owner_id)
                petOfOwner = pet;
        })

        if(petOfOwner !== undefined)
            loadPetInfo(petOfOwner);
        else{
            let h2 = document.createElement('h2');
            h2.textContent = 'No Pet';
            $('.pet-info').prepend(h2);
            $('.pet-info dl').remove();
        }
    })
}

function loadPetInfo(pet){
       
    infoClass = $('.pet-info');
    let h2 = document.createElement('h2');
    h2.textContent = pet['name'] + "'s information";
    infoClass.prepend(h2);
    
    infoClassDl = $('.pet-info dl');
    
    for (let key in pet) {
        if (pet.hasOwnProperty(key) && key !== 'pet_id' && key!== 'owner_id') {
            let div = document.createElement('div');
            div.classList.add('key-value-pair');
    
            var newKey = document.createElement('dt');
            newKey.textContent = key;
            div.appendChild(newKey);
    
            var newValue = document.createElement('dd');
            newValue.textContent = pet[key];
            newValue.setAttribute('id', key);
    
            
    
            div.appendChild(newValue);
            
    
            infoClassDl.append(div);
        }
    }
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



function loadPetKeepers(){
    getPets(function(petsJson){
        let pets = [];
        for (let pet of petsJson) {
          pets.push(JSON.parse(pet));
        }

        let owner = JSON.parse(getCookie('user'));
        let petOfOwner;
        pets.forEach(pet => {
            if(parseInt(pet.owner_id) === owner.owner_id)
                petOfOwner = pet;
        });

        if (petOfOwner === undefined){
            $('.sort-container').remove();
            alert("You have to add a pet to your profile before booking a pet keeper");
            window.location.href = "addPet.html";
        }


        getPetKeepers(function (petKeepersJson) {
            
            let keepers = [];
            let keepersToShow = [];
            keepers.push(...petKeepersJson.map(jsonString => JSON.parse(jsonString)));

            getBookings(function(bookingJson){
                let bookings = [];
                bookings.push(...bookingJson.map(jsonString => JSON.parse(jsonString)));
                

                bookings.forEach(booking => {
                    
                    if (booking.status === 'accepted') {
                        keepers = keepers.filter(keeper => keeper.keeper_id !== parseInt(booking.keeper_id));  //dont show keepers with booking status accepted
                    }
        
                });

                
                keepers.forEach(keeper => {
                    let hasDog = (keeper.dogkeeper === 'true');
                    let hasCat = (keeper.catkeeper === 'true');
        
    
                    if((petOfOwner === undefined || petOfOwner.type.toLowerCase() === 'dog' && hasDog) || (petOfOwner.type.toLowerCase() === 'cat' && hasCat) ){
                        keepersToShow.push(keeper)
                    }
        
                });

                showKeepers(keepersToShow, petOfOwner);
            });
            
          });
    })

}

function sortKeepers(keepers, petOfOwner){
    let sortedBy = $('#sort-dropdown').val();
    user = JSON.parse(getCookie('user'));

    if(sortedBy === 'distance'){
        keepers.sort(function(a, b) {
            const distanceA = parseFloat(getDistance(user.lat, user.lon, a.lat, a.lon));
            const distanceB = parseFloat(getDistance(user.lat, user.lon, b.lat, b.lon));
    
            return distanceA - distanceB;
        });
    }else if(sortedBy === 'price'){

        if(petOfOwner === undefined){
            keepers.sort(function(a, b) {
            
                const priceA = (parseInt(a.dogprice) + parseInt(a.catprice))/2;
                const priceB = (parseInt(b.dogprice) + parseInt(b.catprice))/2;
    
                return priceA - priceB;
            });
        }else if(petOfOwner.type.toLowerCase() === 'dog'){
            keepers.sort(function(a, b) {
            
                const priceA = parseInt(a.dogprice);
                const priceB = parseInt(b.dogprice);
    
                return priceA - priceB;
            });
        }else if(petOfOwner.type.toLowerCase() === 'cat'){
            keepers.sort(function(a, b) {
            
                const priceA = parseInt(a.catprice);
                const priceB = parseInt(b.catprice);
    
                return priceA - priceB;
            });
        }
        
    }else if(sortedBy === 'username'){
        keepers.sort(function(a, b) {
            return a.username.localeCompare(b.username);
        });
    }
 
    return keepers;
}


function showKeepers(keepers, petOfOwner){
    let container = $('.petkeepers-info-container');
    container.empty();

    keepers = sortKeepers(keepers, petOfOwner);
    user = JSON.parse(getCookie('user'));


    keepers.forEach(keeper => {
        let hasDog = (keeper.dogkeeper === 'true');
        let hasCat = (keeper.catkeeper === 'true');

        let divKeeper = document.createElement('div');
        divKeeper.classList.add('petKeeper');
    
        let h2 = document.createElement('h2');
        h2.textContent = '@' + keeper.username; 
        divKeeper.appendChild(h2);
    
        let name = document.createElement('p');
        name.innerHTML = 'Name: <span class="keeperName">' + keeper.firstname + " " + keeper.lastname + '</span>';
        divKeeper.appendChild(name);
    
        let email = document.createElement('p');
        email.innerHTML = 'Email: <span class="keeperEmail">' + keeper.email +'</span>';
        divKeeper.appendChild(email);
    
        let city = document.createElement('p');
        city.innerHTML = 'City: Heraklion';
        divKeeper.appendChild(city);
    
        let property = document.createElement('p');
        property.innerHTML = 'Property: Outdoor';
        divKeeper.appendChild(property);

        let distance = document.createElement('p');
        distance.innerHTML = 'Distance: ' + getDistance(user.lat, user.lon, keeper.lat, keeper.lon).toFixed(2) + " km";
        divKeeper.appendChild(distance);
        
        let keeps = document.createElement('p');
        if(hasDog && hasCat){
            keeps.innerHTML = 'Keeps: Dogs/Cats';
            divKeeper.appendChild(keeps);
            let cat = document.createElement('p');
            cat.innerHTML = 'Cat Price: $<span class="keeperPrice">'+ keeper.catprice +'</span>/day'; 
            divKeeper.appendChild(cat);
            let dog = document.createElement('p');
            dog.innerHTML = 'Dog Price: $<span class="keeperPrice">'+ keeper.dogprice +'</span>/day';
            divKeeper.appendChild(dog);
    
        }else if(hasDog){
            keeps.innerHTML = 'Keeps: Dogs';
            divKeeper.appendChild(keeps);
            let dog = document.createElement('p');
            dog.innerHTML = 'Dog Price: $<span class="keeperPrice">'+ keeper.dogprice +'</span>/day';
            divKeeper.appendChild(dog);    
        }else{
            keeps.innerHTML = 'Keeps: Cats';
            divKeeper.appendChild(keeps);
            let cat = document.createElement('p');
            cat.innerHTML = 'Cat Price: $<span class="keeperPrice">'+ keeper.catprice +'</span>/day'; 
            divKeeper.appendChild(cat);
    
        }
        let price = document.createElement('p');
        price.innerHTML = 'Price: $<span class="keeperPrice">'+ keeper.catprice +'</span>/day';
    
    
        let button = document.createElement('button');
        button.textContent = 'Book Pet Keeper';
        button.addEventListener('click', function(){ bookKeeper(keeper, petOfOwner) });
        divKeeper.appendChild(button);
        
        
        container.append(divKeeper);
    });
    
}


function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // radius of the Earth
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // distance in kilometers

    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
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


function bookKeeper(keeper, petofowner) {
    $('.book-pop-up').css('display', 'flex');

    const h2 = document.createElement('h2');
    h2.textContent = 'Book for @' + keeper.username;

    const form = document.createElement('form');
    form.setAttribute('id', 'booking-form');

    const fromdateLabel = document.createElement('label');
    fromdateLabel.setAttribute('for', 'fromdate');
    fromdateLabel.textContent = 'From Date:';
    const fromdateInput = document.createElement('input');
    fromdateInput.setAttribute('id', 'fromdate');
    fromdateInput.setAttribute('type', 'date');
    fromdateInput.setAttribute('name', 'fromdate');
    fromdateInput.setAttribute('required', 'true');

    const todateLabel = document.createElement('label');
    todateLabel.setAttribute('for', 'todate');
    todateLabel.textContent = 'To Date:';
    const todateInput = document.createElement('input');
    todateInput.setAttribute('id', 'todate');
    todateInput.setAttribute('type', 'date');
    todateInput.setAttribute('name', 'todate');
    todateInput.setAttribute('required', 'true');

    fromdateInput.addEventListener('change', function () {
        dateChanged(keeper, petofowner.type, fromdateInput.value, todateInput.value);
    });
    todateInput.addEventListener('change', function () {
        dateChanged(keeper, petofowner.type, fromdateInput.value, todateInput.value);
    });

    const paragraph = document.createElement('p');
    const strong = document.createElement('strong');
    strong.setAttribute('id', 'total-price');
    if (petofowner.type.toLowerCase() === 'dog') {
        strong.textContent = keeper.dogprice + '$';
    } else {
        strong.textContent = keeper.catprice + '$';
    }
    paragraph.textContent = 'Total Price: ';
    paragraph.appendChild(strong);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.setAttribute('class', 'buttons');

    const cancelButton = document.createElement('button');
    cancelButton.setAttribute('id', 'cancel-button');
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', function () {
        cancelButtonCalled();
    });

    const bookButton = document.createElement('button');
    bookButton.setAttribute('id', 'book-button');
    bookButton.textContent = 'Book';
    bookButton.addEventListener('click', function () {
        bookButtonCalled(keeper, petofowner);
    });

    form.appendChild(fromdateLabel);
    form.appendChild(fromdateInput);
    form.appendChild(todateLabel);
    form.appendChild(todateInput);
    form.appendChild(paragraph);

    buttonsDiv.appendChild(cancelButton);
    buttonsDiv.appendChild(bookButton);

    const bookPopUp = $('.book-pop-up');
    bookPopUp.empty();
    bookPopUp.append(h2, form, buttonsDiv);
}

function dateChanged(keeper, petType, fromDate, toDate) {
    const fromdateObj = new Date(fromDate);
    const todateObj = new Date(toDate);

    if (fromdateObj > todateObj || fromdateObj < new Date().setHours(0, 0, 0, 0)) {
        alert("Please select a valid date range.");
        $('#fromdate').val('');
        $('#todate').val('');
        return;
    }

    const days = calculateDaysBetweenDates(fromDate, toDate);
    let totalPrice;
    if (petType === 'dog') {
        totalPrice = keeper.dogprice * days;
    } else {
        totalPrice = keeper.catprice * days;
    }

    $('#total-price').text(totalPrice + "$");
}

function calculateDaysBetweenDates(fromDate, toDate) {
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const days = Math.round(Math.abs((startDate - endDate) / oneDay)) + 1; // include the last day
    return days;
}


function cancelButtonCalled(){
    event.preventDefault();
    $('.book-pop-up').css('display', 'none');
    $('.review-pop-up').css('display', 'none');
}

function bookButtonCalled(keeper, pet){
    event.preventDefault();
    const bookingForm = document.getElementById('booking-form');

    if (!bookingForm.checkValidity()) {
        alert("Please select a valid date range.");
        $('#fromdate').val('');
        $('#todate').val('');
        return;
    }

    $('.book-pop-up').css('display', 'none');

    
    getBookings(function(bookingJson){
        let bookings = [];

        bookings.push(...bookingJson.map(jsonString => JSON.parse(jsonString)));
        user = JSON.parse(getCookie('user'));
                

        let cancelBooking = false;
        bookings.forEach(booking => {
            if(cancelBooking)
                return;
            
            if(booking.owner_id == user.owner_id){
                if(booking.status === 'requested'){
                    alert('You already have a pending booking request');
                    cancelBooking = true;
                    return;
                }else if(booking.status === 'accepted'){
                    alert('Wait until your previous request is finished before booking another one');
                    cancelBooking = true;
                    return;
                }
            }

            if(booking.status === 'rejected' && booking.owner_id == user.owner_id && booking.keeper_id == keeper.keeper_id){
                alert('Pet Keeper "' + booking.keeper_id + '" has rejected your book request');
                cancelBooking = true;
                return;
            }
        });

        if(cancelBooking)
                return;

        booking = {};
        booking.pet_id = pet.pet_id;
        booking.owner_id = user.owner_id;
        booking.keeper_id = keeper.keeper_id;
        booking.fromdate = $('#fromdate').val();
        booking.todate = $('#todate').val();
        booking.price = $('#total-price').text().slice(0, -1); //remove dollar $
        booking.status = 'requested';
        
        const params = new URLSearchParams(Object.entries(booking));
        const bookingToString = params.toString();
        

        addBookingInDatabase(bookingToString);
    });

    
}

function addBookingInDatabase(booking){
    $.ajax({
        type: 'POST',
        url: '../BookingsServlet',
        data: booking,
        success: function(response) {

        },
        error: function() {
            console.error("Error addBookingInDatabase");
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


function loadBookings(){
    getBookings(function(bookingJson){
        let bookings = [];
        bookings.push(...bookingJson.map(jsonString => JSON.parse(jsonString)));
        user = JSON.parse(getCookie('user'));

        const allBookingsContainer = document.querySelector('.all-bookings');
        getPetKeepers(function (petKeepersJson) {
            
            let keepersMap = {};  //keepers map that stores keepers_id and username

            petKeepersJson.forEach(keeperJson => {
                let keeper = JSON.parse(keeperJson);
                keepersMap[keeper.keeper_id] = keeper.username;
            });

            bookings.forEach(booking => {
                if (booking.owner_id == user.owner_id) {
                    const bookingElement = document.createElement('div');
                    bookingElement.classList.add('booking');
                    
                    let buttonMessage, buttonFunction;
                    if(booking.status === 'accepted'){
                        buttonMessage = 'Send Message';
                        buttonFunction = `showMessages(${JSON.stringify(booking)}, ${JSON.stringify(keepersMap)})`;
                    }else if(booking.status === 'finished'){
                        buttonMessage = 'Review';
                        buttonFunction = `review(${JSON.stringify(booking)}, ${JSON.stringify(keepersMap)})`;
                    }else{

                    }

                    bookingElement.innerHTML = `
                      <p>${booking.booking_id}</p>
                      <p>${'@' + keepersMap[booking.keeper_id]}</p>
                      <p>${booking.fromdate}</p>
                      <p>${booking.todate}</p>
                      <p>${booking.price}$</p>
                      <p>${booking.status}</p>
                    `;

                    if(buttonMessage !== undefined){
                        bookingElement.innerHTML += `<button onClick='${buttonFunction}'>${buttonMessage}</button>`;
                    }

                    if(booking.status === 'accepted'){
                        bookingElement.innerHTML += `<button id='finish-button' onClick='finishBooking(${JSON.stringify(booking)})'>Finish</button>`;
                    }
                  
                    allBookingsContainer.appendChild(bookingElement);
                }
    
            });
        });
        
    });
}

function finishBooking(booking){
    updateStatus(booking.booking_id, 'finished');
}

function updateStatus(booking_id, status) {
    $.ajax({
        type: 'PUT',
        url: '../BookingsServlet',
        data: {booking_id: booking_id, status: status},
        success: function(response) {               //reseting bookings
            $('.all-bookings').html('');
            loadBookings();
        },
        error: function() {
            console.error("Error updateStatus");
        }
    });
}


var bookingMessages;

function showMessages(booking, keepersMap){
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
            if(message.sender === 'keeper'){
                senderSide = 'left-sender-message';
                messageSide = 'left-message';
            }else{
                senderSide = 'right-sender-message';
                messageSide = 'right-message';
            }
            if(senderSide === 'left-sender-message'){
                $('.messages-container').html( $('.messages-container').html() + 
                ` <div class=${senderSide}>
                    <div class="message-sender">@${keepersMap[booking.keeper_id]}</div>
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
    messageObj.sender = 'owner';
    const currentDate = new Date();
    const formattedDateTime = `${currentDate.getFullYear()}-${padZero(currentDate.getMonth() + 1)}-${padZero(currentDate.getDate())} ${padZero(currentDate.getHours())}:${padZero(currentDate.getMinutes())}:${padZero(currentDate.getSeconds())}`;
    messageObj.datetime = formattedDateTime;

    addMessage(messageObj);

    getPetKeepers(function (petKeepersJson) {
            
        let keepersMap = {};  //keepers map that stores keepers_id and username

        petKeepersJson.forEach(keeperJson => {
            let keeper = JSON.parse(keeperJson);
            keepersMap[keeper.keeper_id] = keeper.username;
        });
        showMessages(bookingMessages, keepersMap);

    });
}

function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

function closeMessages(){
    $('.messages-container').css('display', 'none');
    $('.close-messages').css('display', 'none');
    $('.new-message-input').css('display', 'none');
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



function review(booking, keepersMap){
    getReviews(booking.keeper_id, function(reviewsJson){
        let cancelReview = false;
        let reviews = [];
        reviews.push(...reviewsJson.map(jsonString => JSON.parse(jsonString)));
        reviews.forEach(review => {
            if(review.owner_id === booking.owner_id){
                alert('Already reviewed this pet keeper');
                cancelReview = true;
            }
        });

        if(cancelReview){
            return;
        }

        let reviewPopUp = $('.review-pop-up')
        
        reviewPopUp.css('display', 'flex');

        reviewPopUp.html(`
        <h2>Review for @${keepersMap[booking.owner_id]}</h2>
        <form id="review-form">
            <div class="star-rating" id="star-rating">
                <input type="radio" name="rating" id="star1" value="5">
                <label for="star1"></label>
                <input type="radio" name="rating" id="star2" value="4">
                <label for="star2"></label>
                <input type="radio" name="rating" id="star3" value="3" checked>
                <label for="star3"></label>
                <input type="radio" name="rating" id="star4" value="2">
                <label for="star4"></label>
                <input type="radio" name="rating" id="star5" value="1">
                <label for="star5"></label>
            </div>
        <textarea name="review-field" id="review-field" cols="30" rows="8" required></textarea>

        <div class="buttons">
            <button id="cancel-button" onclick="cancelButtonCalled()">Cancel</button>
            <button id="submit-review-button" onclick='reviewButtonCalled(${JSON.stringify(booking)})'>Submit</button>
            </div>
        </form>`
        );
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

function reviewButtonCalled(booking){
    event.preventDefault();

    const reviewForm = document.getElementById('review-form');

    if (!reviewForm.checkValidity()) {
        alert("Please fill out the review form");
        return;
    }


    reviewObj = {};
    reviewObj.owner_id = booking.owner_id;
    reviewObj.keeper_id = booking.keeper_id;
    reviewObj.reviewText = $('#review-field').val();
    reviewObj.reviewScore = $('input[name="rating"]:checked').val();

    
    addReview(reviewObj);
    $('.review-pop-up').css('display', 'none');


    

    
}


function addReview(review) {
    $.ajax({
        type: 'POST',
        url: '../ReviewsServlet',
        data: review,
        success: function(response) {

        },
        error: function() {
            console.error("Error addReview");
        }
    });
}