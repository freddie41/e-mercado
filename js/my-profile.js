// Fetch all the user fields to save and show values.
var userFirstName = document.getElementById("firstName");
var userLastNames = document.getElementById("lastNames");
var userEmail = document.getElementById("email");
var userPhone = document.getElementById("phone");
var userDob = document.getElementById("dob");
var userDocument = document.getElementById("document");
var userBio = document.getElementById("bio");

//Fetch all profile fields to show data.
var profileImg = document.getElementById("profilePic");
var profileName = document.getElementById("profileName");
var profileEmail = document.getElementById("profileEmail");
var profilePhone = document.getElementById("profilePhone");
var profileAge = document.getElementById("profileAge");
var profileBio = document.getElementById("profileBio");


//Funcion para calcular la edad dada una fecha de nacimiento.
function getAge(birth) {
  var today = new Date();
  var curr_date = today.getDate();
  var curr_month = today.getMonth() + 1;
  var curr_year = today.getFullYear();

  var pieces = birth.split('/');
  var birth_date = pieces[0];
  var birth_month = pieces[1];
  var birth_year = pieces[2];

  if (curr_month == birth_month && curr_date >= birth_date) {
    return parseInt(curr_year - birth_year);
  }
  if (curr_month == birth_month && curr_date < birth_date) {
    return parseInt(curr_year - birth_year - 1);
  }
  if (curr_month > birth_month) {
    return parseInt(curr_year - birth_year);
  }
  if (curr_month < birth_month) {
    return parseInt(curr_year - birth_year - 1);
  }
}

//Funcion para modificar la imagen de perfil por defecto por una
// nueva imagen de perfil cargada por el usuario
function changeProfilePicture() {

  $(document).on("change", ".uploadProfileInput", function () {
    var triggerInput = this;
    var currentImg = $(this).closest(".pic-holder").find(".pic").attr("src");
    var holder = $(this).closest(".pic-holder");
    var alert = document.getElementById("alertPic");
    $(alert).find('[role="alert"]').remove();
    var files = !!this.files ? this.files : [];
    
    if (!files.length || !window.FileReader) {
      return;
    }
    if (/^image/.test(files[0].type)) {
      // only image file
      var reader = new FileReader(); // instance of the FileReader
      reader.readAsDataURL(files[0]); // read the local file

      reader.onloadend = function () {
        $(holder).addClass("uploadInProgress");
        $(holder).find(".pic").attr("src", this.result);
        $(holder).append(
          `<div class="upload-loader">
                <div class="spinner-border text-info" role="status">
                  <span class="sr-only">Cargando...</span>
                </div>
              </div>
              `
        );

        //New img local save.
        localStorage.setItem("newProfilePic", this.result);

        // Dummy timeout; call API or AJAX below
        setTimeout(() => {
          $(holder).removeClass("uploadInProgress");
          $(holder).find(".upload-loader").remove();
          // If upload successful
          if (Math.random() < 0.9) {
            $(alert).append(`
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="fa fa-check-circle text-success mx-2"></i><strong>Éxito.</strong> Imagen de perfil actualizada.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `
            ).removeClass("hide").hide().fadeIn(300);

            // Clear input after upload
            $(triggerInput).val("");

            setTimeout(() => {
              $(alert).find('[role="alert"]').animate({ opacity: 0 }, 300).remove(300);
            }, 3000);
          } else {
            $(holder).find(".pic").attr("src", currentImg);
            $(alert).append(`
                <div class="alert alert-danger alert-dismissible hide" role="alert">
                    <i class="fa fa-times-circle text-danger mx-2"></i><strong>Error.</strong> Inténtelo de nuevo más tarde.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `
            ).removeClass("hide").hide().fadeIn(300);

            // Clear input after upload
            $(triggerInput).val("");
            setTimeout(() => {
              $(alert).find('[role="alert"]').animate({ opacity: 0 }, 300).hide(300);
            }, 3000);
          }
        }, 1500);
      };
    } else {
      $(alert).append(
        `<div class="alert alert-danger d-inline-block p-2 small" role="alert">Por favor, elija una imagen válida.</div>`
      );
      setTimeout(() => {
        $(alert).find('role="alert"').remove(300);
      }, 3000);
    }
  });
}

//Funcion para validar que todos los campos obligatorios del perfil
// se hayan completado antes de ser guardados
function validateAndSaveData() {
  window.addEventListener('load', function () {

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');

    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (form.checkValidity() === false) {

          setTimeout(function () {
            $('<div class="dangerAlert alert alert-danger">' +
            '<i class="fa fa-times-circle text-danger mx-2"></i>' +
            '<strong>Error.</strong> Corrija los campos señalados.' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '&times;</button></div>').hide().appendTo('#alertInfo').fadeIn(300);
        
            $(".alert").delay(3000).fadeOut(
              "normal",
              function () {
                $(this).remove().fadeIn(300);
              }
            );
          }, 300);

        } else {

          localStorage.setItem("userProfile", (JSON.stringify({
            userName: userFirstName.value,
            userLastNames: userLastNames.value,
            userEmail: userEmail.value,
            userPhone: userPhone.value,
            userDob: userDob.value,
            userDocument: userDocument.value,
            userBio: userBio.value
          })));

          setTimeout(function () {
            $('<div class="successAlert alert alert-success">' +
            '<i class="fa fa-check-circle text-success mx-2"></i>' +
            '<strong>Éxito.</strong> Info del perfil actualizada.' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '&times;</button></div>').hide().appendTo('#alertInfo').fadeIn(300);
        
            $(".alert").delay(3000).fadeOut(
              "normal",
              function () {
                $(this).remove().fadeIn(300);
              }
            );
            showSavedData();
          }, 300);
        }
        form.classList.add('was-validated');
      });
    });
  });
}
  

//Funcion para mostrar todos los datos disponibles generados tras el login.
function showLoginUserData() {

  //Get User/googleUser data
  var userLogged = localStorage.getItem("userLogged");
  var gUserProfile = localStorage.getItem("googleUserProfile");

  //Control para mostrar user logged o google user logged.
  if (userLogged) {

    userLogged = JSON.parse(userLogged);

    //Mail mostrado en el panel del perfil de usuario.
    profileEmail.innerText = userLogged.user;
    profileEmail.setAttribute("href", `mailto:${userLogged.user}`);

    //Mail mostrado en el input value del email.
    userEmail.value = userLogged.user;
  }

  if (gUserProfile) {

    gUserProfile = JSON.parse(gUserProfile);

    //Google profile img mostrada en el perfil de usuario.
    // + deshabilita cambio de img.
    profileImg.src = gUserProfile.gUserImg;

    //Google full name mostrado en el perfil del usuario.
    profileName.innerText = gUserProfile.gUserFullName;

    //Gmail mostrado en el panel del perfil de usuario.
    profileEmail.innerText = gUserProfile.gUserEmail;
    profileEmail.setAttribute("href", `mailto:${gUserProfile.gUserEmail}`);

    //Google name mostrado en el input value panel del perfil del usuario.
    userFirstName.value = gUserProfile.gUserName;

    //Google name mostrado en el input value panel del perfil del usuario.
    userLastNames.value = gUserProfile.gUserLastnames;

    //Gmail mostrado en el input value del email.
    userEmail.value = gUserProfile.gUserEmail;
  }

}

//Funcion para mostrar los valores guardados en los campos.
function showSavedData() {

  //Get objeto con todos los datos ingresados.
  var userProfile = localStorage.getItem("userProfile");
  var userNewProfilePic = localStorage.getItem("newProfilePic");
  userProfile = JSON.parse(userProfile);

  //Show saved user data.
  if (userProfile != null) {
    userFirstName.value = userProfile.userName;
    userLastNames.value = userProfile.userLastNames;
    userEmail.value = userProfile.userEmail;
    userPhone.value = userProfile.userPhone;
    userDob.value = userProfile.userDob;
    userDocument.value = userProfile.userDocument;
    userBio.value = userProfile.userBio;

    //Show saved profile data.
    profileName.innerText = userProfile.userName + " " + userProfile.userLastNames;
    profileEmail.innerText = userProfile.userEmail;
    profileEmail.setAttribute("href", `mailto:${userProfile.userEmail}`);
    profilePhone.innerText = userProfile.userPhone;
    profilePhone.setAttribute("href", `https://api.whatsapp.com/send?phone=598${userProfile.userPhone}`);
    profileAge.innerText = getAge(userProfile.userDob) + " años";
    profileBio.innerText = userProfile.userBio;
  }
  //Show new img saved.
  if (userNewProfilePic != null) {
    profileImg.src = userNewProfilePic;
  }
}

//Funcion para refrescar la página y limpiar los cambios no guardados.
function cleanFields() {

  document.getElementById("cancelSaveUserData").addEventListener("click", function (e) {
    window.location = "my-profile.html";
  });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

  //Se muestra user data obtenida post login.
  showLoginUserData();

  //Se ejecuta validación y guardado de valores en campos de user data.
  validateAndSaveData();

  //Se muestra la información guardada en todos los campos.
  showSavedData();

  //Ejecuta el cambio de img del perfil.
  changeProfilePicture();

  //Limplia los campos no guardados al refrescar el sitio.
  cleanFields();

});