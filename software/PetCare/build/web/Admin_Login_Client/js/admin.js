function loadUsers() {
    getPetOwners(function (petOwnersJson) {
      let petOwners = [];
      for (let ownerJson of petOwnersJson) {
        let owner = JSON.parse(ownerJson);
        petOwners.push(owner);
      }
  
      const userProfilesContainer = document.querySelector('.user-profiles.petowner-profiles');
  

  
      for (let i = 0; i < petOwners.length; i++) {
        const owner = petOwners[i];
  
        const petOwnerDiv = document.createElement('div');
        petOwnerDiv.classList.add('pet-owner');
  
        petOwnerDiv.innerHTML = `
          <h4>Owner ID: ${owner.owner_id}</h4>
          <p id='username'><strong>Username:</strong> ${owner.username}</p>
          <p><strong>Name:</strong> ${owner.firstname } ${owner.lastname}</p>
          <p><strong>Email:</strong> ${owner.email}</p>
          <button class="delete-button"  onclick="deletePetOwners('${owner.owner_id}', this)">Delete User</button>
        `;
  
        userProfilesContainer.appendChild(petOwnerDiv);
      }
    });

    getPetKeepers(function (petKeepersJson) {
        let petKeepers = [];
        for (let keeperJson of petKeepersJson) {
          let keeper = JSON.parse(keeperJson);
          petKeepers.push(keeper);
        }
    
        const userProfilesContainer = document.querySelector('.user-profiles.petkeeper-profiles');
    
  
    
        for (let i = 0; i < petKeepers.length; i++) {
          const keeper = petKeepers[i];
    
          const petKeeperDiv = document.createElement('div');
          petKeeperDiv.classList.add('pet-keeper');
    
          petKeeperDiv.innerHTML = `
            <h4>Keeper ID: ${keeper.keeper_id}</h4>
            <p><strong>Username:</strong> ${keeper.username}</p>
            <p><strong>Name:</strong> ${keeper.firstname } ${keeper.lastname}</p>
            <p><strong>Email:</strong> ${keeper.email}</p>
            <button class="delete-button"  onclick="deletePetKeepers('${keeper.keeper_id}', this)">Delete User</button>
          `;
    
          userProfilesContainer.appendChild(petKeeperDiv);
        }
      });


  }

  function deletePetKeepers(userID, button){
    deletePetKeepersAjax(userID);

    const userProfilesContainer = document.querySelector('.user-profiles.petkeeper-profiles');
    const petKeeperDiv = button.closest('.pet-keeper');

    if (petKeeperDiv) 
      userProfilesContainer.removeChild(petKeeperDiv);
    
  }


  function deletePetOwners(userID, button){
    deletePetOwnersAjax(userID);

    const userProfilesContainer = document.querySelector('.user-profiles.petowner-profiles');
    const petOwnerDiv = button.closest('.pet-owner');

    if (petOwnerDiv) 
      userProfilesContainer.removeChild(petOwnerDiv);
    
  }


  function loadStats(){
    google.charts.load('current', {'packages':['corechart']});

    getPets(function(petsJson){
        let pets = {};
        for (let pet of petsJson) {
          let petType = JSON.parse(pet).type.toLowerCase();
          pets[petType] = (pets[petType] || 0) + 1;
        }

        
        getPetOwners(function (petOwnersJson) {
          let ownersCount = petOwnersJson.length;
      
          
          getPetKeepers(function (petKeepersJson) {
            let keepersCount = petKeepersJson.length;

            let users = {'Pet Keepers' : keepersCount, 'Pet Owners' : ownersCount};

            getBookings(function (bookingJson){

              let bookings = [];
              bookings.push(...bookingJson.map(jsonString => JSON.parse(jsonString)));
              let totalMoney = 0;

              for(let booking of bookings){
                if(booking.status == 'finished'){
                  totalMoney += booking.price;
                }
              }

              let earnings = {'Website Earnings' : totalMoney*0.15, 'Pet Keepers Earnings' : totalMoney*0.85};



                google.charts.setOnLoadCallback(function(){
                  drawChart(pets, 'pets');
                  drawChart(users, 'users');
                  drawChart(earnings, 'earnings');
                });
            

              });
          });
          
        });
    });
  }

  function drawChart(data, typeOfData) {

    chartData = [['Pet Type', 'Count']];
    for (var type in data) {
      chartData.push([type, data[type]]);
    }

    var options = {
      'title': typeOfData === 'pets' ? 'Pets' : 'Users',
      'width': '100%',
      'height': 400,
      'backgroundColor': '#cccccc',
      'titleTextStyle': {
        'fontSize': 18 
      },
      'legend': {
        'textStyle': {
            'fontSize': 14 
        }
      }
    };    
  
    var dataTable = google.visualization.arrayToDataTable(chartData);


    var chart = new google.visualization.PieChart(document.getElementById( typeOfData + '-chart'));
    chart.draw(dataTable, options);
    
  }