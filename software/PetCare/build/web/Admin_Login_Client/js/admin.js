function loadUsers() {
    getPetOwners(function (petOwnersJson) {
      let petOwners = [];
      for (let ownerJson of petOwnersJson) {
        let owner = JSON.parse(ownerJson);
        petOwners.push(owner);
      }
  
      // Select the user-profiles container
      const userProfilesContainer = document.querySelector('.user-profiles.petowner-profiles');
  

  
      // Iterate through petOwners and create profiles
      for (let i = 0; i < petOwners.length; i++) {
        const owner = petOwners[i];
  
        // Create a new pet-owner div
        const petOwnerDiv = document.createElement('div');
        petOwnerDiv.classList.add('pet-owner');
  
        // Fill in the content for the pet-owner div
        petOwnerDiv.innerHTML = `
          <h4>Owner ID: ${owner.owner_id}</h4>
          <p id='username'><strong>Username:</strong> ${owner.username}</p>
          <p><strong>Name:</strong> ${owner.firstname } ${owner.lastname}</p>
          <p><strong>Email:</strong> ${owner.email}</p>
          <button class="delete-button"  onclick="deletePetOwners('${owner.owner_id}', this)">Delete User</button>
        `;
  
        // Append the pet-owner div to the user-profiles container
        userProfilesContainer.appendChild(petOwnerDiv);
      }
    });

    getPetKeepers(function (petKeepersJson) {
        let petKeepers = [];
        for (let keeperJson of petKeepersJson) {
          let keeper = JSON.parse(keeperJson);
          petKeepers.push(keeper);
        }
    
        // Select the user-profiles container
        const userProfilesContainer = document.querySelector('.user-profiles.petkeeper-profiles');
    
  
    
        // Iterate through petOwners and create profiles
        for (let i = 0; i < petKeepers.length; i++) {
          const keeper = petKeepers[i];
    
          // Create a new pet-owner div
          const petKeeperDiv = document.createElement('div');
          petKeeperDiv.classList.add('pet-keeper');
    
          // Fill in the content for the pet-owner div
          petKeeperDiv.innerHTML = `
            <h4>Keeper ID: ${keeper.keeper_id}</h4>
            <p><strong>Username:</strong> ${keeper.username}</p>
            <p><strong>Name:</strong> ${keeper.firstname } ${keeper.lastname}</p>
            <p><strong>Email:</strong> ${keeper.email}</p>
            <button class="delete-button"  onclick="deletePetKeepers('${keeper.keeper_id}', this)">Delete User</button>
          `;
    
          // Append the pet-owner div to the user-profiles container
          userProfilesContainer.appendChild(petKeeperDiv);
        }
      });


  }

  function deletePetKeepers(userID, button){
    deletePetKeepersAjax(userID);

    const userProfilesContainer = document.querySelector('.user-profiles.petkeeper-profiles');
    const petKeeperDiv = button.closest('.pet-keeper');

    console.log(userProfilesContainer);
    console.log(petKeeperDiv);
    if (petKeeperDiv) 
      userProfilesContainer.removeChild(petKeeperDiv);
    
  }


  function deletePetOwners(userID, button){
    deletePetOwnersAjax(userID);

    const userProfilesContainer = document.querySelector('.user-profiles.petowner-profiles');
    const petOwnerDiv = button.closest('.pet-owner');

    console.log(userProfilesContainer);
    console.log(petOwnerDiv);
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

        console.log(pets);
        
        getPetOwners(function (petOwnersJson) {
          let ownersCount = petOwnersJson.length;
      
          
          getPetKeepers(function (petKeepersJson) {
            let keepersCount = petKeepersJson.length;

            let users = {'Pet Keepers' : keepersCount, 'Pet Owners' : ownersCount};

              google.charts.setOnLoadCallback(function(){
                drawChart(pets, 'pets');
                drawChart(users, 'users');
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
      'title': typeOfData === 'pets' ? 'Pets' : 'Users', // Adjust title based on typeOfData
      'width': '100%',
      'height': 400,
      'backgroundColor': '#cccccc',
      'titleTextStyle': {
        'fontSize': 18 // Set the font size for the title
      },
      'legend': {
        'textStyle': {
            'fontSize': 14 // Set the font size for the legend (fields)
        }
      }
    };    
  
    var dataTable = google.visualization.arrayToDataTable(chartData);


    var chart = new google.visualization.PieChart(document.getElementById( typeOfData + '-chart'));
    chart.draw(dataTable, options);
    
  }