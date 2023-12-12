var canUseUsername = null;
var canUseEmail = null;

function checkAll() {

    removeWarnings(); 

    if( !(checkPasswords() && checkCheckbox()) ){
      event.preventDefault(); 
      return;
    }

    if(!(canUseUsername)){
      scroll($("#username"));
      displayWarning($("#username"), "Username is already taken.");
      event.preventDefault(); 
      return;
    }

    if(!(canUseEmail)){
      scroll($("#email"));
      displayWarning($("#email"), "Email is already taken.");
      event.preventDefault();
      return;
    }


}




 
function checkUsernames(){

   checkUsernamesFromDatabase(function(canUse) {
          canUseUsername= canUse;
          if(!canUseUsername){
            displayWarning($("#username"), "Username already in use.");
            scroll($("#username"));
            canUseUsername = false;
          }else{
              removeWarnings();
              canUseUsername = true;

          }  

   });

}

function checkEmails(){

  checkEmailsFromDatabase(function(canUse) {
         canUseEmail= canUse;
         if(!canUseEmail){
           displayWarning($("#email"), "Email already in use.");
           scroll($("#email"));
           canUseEmail = false;
         }else{
             removeWarnings();
             canUseEmail = true;
         }  

  });

}
  
  function checkCheckbox(){
    var box = $("#checkbox");
  
    if (box.prop("checked")) {
      return true;
    }

    scroll(box);
    displayWarning(box, "You have to accept the Terms and Conditions");
    return false;  
  }
  
  
  function petKeeperActivate(activate){
      if(activate){
        $(".hidden").css('display', 'block');
        if($('.cat-keeper-price-container').css('display') === 'block' || $('.dog-keeper-price-container').css('display') === 'block')
            $(".keeper-price-container").css('display', 'flex');    

      }else{
        $(".hidden").css('display', 'none');
        $(".keeper-price-container").css('display', 'none');    
      }
  }

  function dogKeeperActivate(){
    removeWarnings();

    if($('.dog-keeper-price-container').css('display') === 'none'){
      $(".dog-keeper-price-container").css('display', 'block');  
      $('.dog-keeper-price-container').attr('required', 'required');
  
      $(".keeper-price-container").css('display', 'flex');  
    }
    else{
      $(".dog-keeper-price-container").css('display', 'none');
      
      $('.dog-keeper-price-container').removeAttr('required');
  
      if($('.cat-keeper-price-container').css('display') === 'none')
        $(".keeper-price-container").css('display', 'none');  
    }
  
  }
  

function catKeeperActivate(){
  removeWarnings();

  if ($('#outdoor').is(':checked')) {
    $('#cat-keeper').prop('checked', false);
    displayWarning($('#cat-keeper'), "Cannot keep a cat outdoors");

    return;
  }

  if($('.cat-keeper-price-container').css('display') === 'none'){
    $(".cat-keeper-price-container").css('display', 'block');  
    $('.cat-keeper-price-container').attr('required', 'required');

    $(".keeper-price-container").css('display', 'flex');  
  }
  else{
    $(".cat-keeper-price-container").css('display', 'none');
    $('.cat-keeper-price-container').removeAttr('required');

    if($('.dog-keeper-price-container').css('display') === 'none')
      $(".keeper-price-container").css('display', 'none');  
  }

}

function checkOutdoor(){  
  if ($('#cat-keeper').is(':checked')) {
    $('#indoor').prop('checked', true);
    displayWarning($('#outdoor'), "Cannot keep a cat outdoors");
  }
}


  function checkPasswords(){
  
    var pass = $('#password');
    var confPass =  $('#confirm-password');
    var strength =  $('#password-strength');
  
    if(checkPasswordKeywords(pass) == false)
        return;

    if(pass.val() !== confPass.val() ){
        scroll(pass);
        displayWarning(pass, "Passwords do not match");
        return false;
    }else if(pass.val() === "" || confPass.val() === ""){
        scroll(pass);
        displayWarning(pass, "Password is incorrect");
        return false;
    }else if(strength.text() === "Weak Password"){
        scroll(pass);
        displayWarning(pass, "Password can not be weak");
        return false;
    }

    return true;
  }
   
  function checkPasswordKeywords(pass) {
    if (pass.val().includes("cat") || pass.val().includes("dog")  || pass.val().includes("gata")  || pass.val().includes("skulos") ) {
      scroll(pass);
      displayWarning(pass, "Password cannot have these values: 'cat', 'dog', 'gata' 'skulos'.");
      return false;
    }
  
    return true;
  }
  
  
  function checkPasswordNumberPercent(pass){
    var count = 0;
    for (var i = 0; i < pass.val().length; i++) {
      var char = pass.val().charAt(i);
      if (char >= '0' && char <= '9') {
        count++;
      }
    }
    if( (count / pass.val().length) >= 0.5 ){
      return false;
    }
  
    return true;
  }
  
  
  function passwordStrength(){
    var strength = $("#password-strength");
    var pass = $('#password');
  
    var symbolPattern = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g;
    var uppercasePattern = /[A-Z]/g;
    var lowercasePattern = /[a-z]/g;
    var numberPattern = /[1-9]/g;
  
    var symbolCount = (pass.val().match(symbolPattern) || []).length;
    var uppercaseCount = (pass.val().match(uppercasePattern) || []).length;
    var lowercaseCount = (pass.val().match(lowercasePattern) || []).length;
    var numbersCount = (pass.val().match(numberPattern) || []).length;
  

    if(pass.val().length > 0)
      strength.css('visibility', 'visible');
    else  
      strength.css('visibility', 'hidden');


    if(checkPasswordNumberPercent(pass) == false){
      strength.css('backgroundColor', 'rgb(256, 20, 60)');
      strength.text('Weak Password');
    }else if(symbolCount >= 1 && uppercaseCount >= 1 && lowercaseCount >= 1 && numbersCount >= 1){
      strength.css('backgroundColor', 'rgb(5, 241, 5)');
      strength.text('Strong Password');
    }else{
      strength.css('backgroundColor', 'rgb(229, 241, 5)');
      strength.text('Medium Password');
    }
    
  }
  
  
  
  function scroll(element) {
    const y = $(element).offset().top - 200;
    window.scrollTo({top: y, behavior: 'smooth'});
  }
  
  
  function displayWarning(targetElement, message) {
  
    var warning = $("<div>").addClass("warnings").text(message);

    if (message.length > 30) {
      warning.css({
        marginTop: "-80px",
        padding: "2px"
      });
    }

    if (targetElement.attr('id') === 'checkbox') {
      warning.css({
        maxWidth: "500px",
        marginLeft: "0px",
        marginTop: "-25px"
      });
    }

    $(targetElement).after(warning);
  }
  
  function removeWarnings() {
    $(".warnings").remove();
  }
  
  function passwordVisibility() {
    var eyeImage = event.target;
  
    var pass;
    if(eyeImage.id == "show-password")
      pass = $('#password');
    else if(eyeImage.id == "show-password-conf")
      pass = $('#confirm-password');
  
    if (eyeImage.src.includes("closed_eye")) {
      eyeImage.src = "Register_Login_Client/resources/open_eye.png";
      pass.attr('type', 'text'); 
    } else {
      eyeImage.src = "Register_Login_Client/resources/closed_eye.png";
      pass.attr('type', 'password'); 
    }
  }


  
 

  var user, usertype;


  function login(username, password){
    event.preventDefault(); 

    if(typeof username === 'undefined'){
      username = $('#username-login').val();
      password = $('#password-login').val();
    }



    tryToLogin(username, password, function(isValidUser, userJson){
        if(isValidUser){
            user = JSON.parse(userJson);
            if('property' in user){
                userType = 'keeper';
            }else{
                userType = 'owner';
            }

            setCookie('user', userJson, 30);
            setCookie('userType', userType, 30);

            window.location.href = 'Register_Login_Client/loggedin.html';

        }else{
            displayWarning( $('#username-login'), "There is no user with this username and password")
          }
    });
}

function logOut(){
    deleteCookie('user');
    deleteCookie('userType');
    window.location.href = '../register.html';
}


function alreadyLoggedIn(){
    if (getCookie("user") !== null){
      window.location.href = 'Register_Login_Client/loggedin.html';
    }
}


    

function initLoginPage() {

  user = JSON.parse(getCookie('user'));
  userType = getCookie('userType');

  infoClass = $('.user-info');
  let h2 = document.createElement('h2');
  h2.textContent = user['username'] + "'s information";
  infoClass.prepend(h2);

  infoClassDl = $('.user-info dl');

  for (let key in user) {
      if (user.hasOwnProperty(key) && key !== 'keeper_id' && key!== 'owner_id' && key !== 'password') {
          let div = document.createElement('div');
          div.classList.add('key-value-pair');

          var newKey = document.createElement('dt');
          newKey.textContent = key;
          div.appendChild(newKey);

          var newValue = document.createElement('dd');
          newValue.textContent = user[key];
          newValue.setAttribute('id', key);

          


          if (key !== 'username' && key !== 'email') {
            var container = document.createElement('div');
            container.classList.add('value-icon-container');

            
            newValue.setAttribute('contenteditable', true);

            var editIcon = document.createElement('span');
            editIcon.textContent = '✏️';
            editIcon.classList.add('edit-icon');
            editIcon.onclick = function () {
                enableEdit(key);
            };

            container.appendChild(newValue)
            container.appendChild(editIcon)

            div.appendChild(container);
        }else{

            div.appendChild(newValue);
        }

          infoClassDl.append(div);
      }
  }

  var editableElements = document.querySelectorAll('[contenteditable="true"]');

    editableElements.forEach(function (element) {
        element.addEventListener('blur', function () {
          var keyValuePair = element.closest('.key-value-pair');
          var key = keyValuePair.querySelector('dt').innerText;
          var value = element.innerText;

          changeValue(key, value, getCookie('user'), getCookie('userType'));

        });
    });
}



function enableEdit(fieldId) {
  var element = document.getElementById(fieldId);
  element.focus(); 
}



    


