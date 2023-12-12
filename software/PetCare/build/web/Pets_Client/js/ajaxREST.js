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

function displayError(status, responseText, message){
    document.getElementById('msg').innerHTML = 'Request failed. Returned status of ' + status + ".<br>";

    try {
        var response = JSON.parse(responseText);
        document.getElementById('msg').innerHTML += message;
    } catch (error) {
        document.getElementById('msg').innerHTML += 'Error parsing the response.';
    }
}

function displaySuccess(status, responseText, message){
    document.getElementById('msg').innerHTML = 'Returned status of ' + status + ".<br>";

    try {
        var response = JSON.parse(responseText);
        document.getElementById('msg').innerHTML += message;
    } catch (error) {
        document.getElementById('msg').innerHTML += 'Error parsing the response.';
    }
}




function addPet() {
    let myForm = document.getElementById('addPetForm');
    let formData = new FormData(myForm);
    
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    var jsonData=JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            displaySuccess(xhr.status, xhr.responseText, JSON.parse(xhr.responseText).message)            
        } else if (xhr.status !== 200) {
            displayError(xhr.status, xhr.responseText, JSON.parse(xhr.responseText).message)
        }
    };
    xhr.open('POST', 'http://localhost:4567/petcare/pet');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(jsonData);
}




function typeBreed() {
    event.preventDefault();

    var type = $('#getType').val();
    var breed = $('#getBreed').val();
    var fromWeight = $('#fromWeight').val();
    var toWeight = $('#toWeight').val();

    var URL = "http://localhost:4567/petcare/pets/" + type + "/" + breed;

    if (fromWeight !== "") {
        URL += "?fromWeight=" + fromWeight;
        if (toWeight !== "") {
            URL += "&toWeight=" + toWeight;
        }
    } else {
        if (toWeight !== "") {
            URL += "?toWeight=" + toWeight;
        }
    }

    $.ajax({
        type: 'GET',
        url: URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function (data, textStatus, xhr) {
            var i = 1;
            var count = Object.keys(data.data).length;
            $('#msg').html("<h3>" + count + " Laptops</h3>");

            for (id in data.data) {
                $('#msg').append(createTableFromJSON(data.data[id], i));
                i++;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            displayError(xhr.status, xhr.responseText, JSON.parse(xhr.responseText).message);
        }
    });
}


function updatePetWeight() {
    event.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            displaySuccess(xhr.status, xhr.responseText, JSON.parse(xhr.responseText).message)
        } else if (xhr.status !== 200) {
            displayError(xhr.status, xhr.responseText, JSON.parse(xhr.responseText).message)
        }
    };
	let id=document.getElementById("updateid").value;
	let weight=document.getElementById("updateWeight").value;
    xhr.open('PUT', 'http://localhost:4567/petcare/petWeight/'+id+"/"+weight);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

function deletePet() {
    event.preventDefault();

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            displaySuccess(xhr.status, xhr.responseText, JSON.parse(xhr.responseText).message)
        } else if (xhr.status !== 200) {
            displayError(xhr.status, xhr.responseText, JSON.parse(xhr.responseText).message)
        }
    };
	let id=document.getElementById("deleteid").value;
    xhr.open('DELETE', 'http://localhost:4567/petcare/petDeletion/'+ id);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
}

