//Obtienen todos los campos del panel de edicion derecho.
var userFirstName = document.getElementById("firstName");
var userLastNames = document.getElementById("lastNames");
var userEmail = document.getElementById("email");
var userPhone = document.getElementById("phone");
var userDob = document.getElementById("dob");
var userDocument = document.getElementById("document");
var userBio = document.getElementById("bio");

//Obtienen todos los campos del panel de info izquierdo.
var profileImg = document.getElementById("profilePic");
var profileName = document.getElementById("profileName");
var profileEmail = document.getElementById("profileEmail");
var profilePhone = document.getElementById("profilePhone");
var profileAge = document.getElementById("profileAge");
var profileBio = document.getElementById("profileBio");


//Funcion para calcular la edad, dada una fecha de nacimiento como input.
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

//Funcion para modificar imagen de perfil por defecto.
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

    //Limitador de carga para un archivo img.
    if (/^image/.test(files[0].type)) {

      //Instanciamiento del lector de archivos.
      var reader = new FileReader(); 

      //Lector de archivos locales.
      reader.readAsDataURL(files[0]);

      reader.onloadend = function () {
        $(holder).addClass("uploadInProgress");
        $(holder).find(".pic").attr("src", this.result);

        //Spinner loader mostrado para el tiempo de carga de la img.
        $(holder).append(
          `<div class="upload-loader">
                <div class="spinner-border text-info" role="status">
                  <span class="sr-only">Cargando...</span>
                </div>
              </div>
              `
        );

        //Guarda la nueva img en local metodo base64.
        localStorage.setItem("newProfilePic", this.result);

        //Dummy timeout; call API or AJAX below
        setTimeout(() => {
          $(holder).removeClass("uploadInProgress");
          $(holder).find(".upload-loader").remove();

          //Control para validar que la img pudo ser cargada de forma exitosa.
          if (Math.random() < 0.9) {
            //Alerta para de exito al cambiar la imagen del perfil.
            $(alert).append(`
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="fa fa-check-circle text-success mx-2"></i><strong>Éxito.</strong> Imagen de perfil actualizada.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `
            ).removeClass("hide").hide().fadeIn(300);//Tiempo de aparición en ms.

            //Se limpia el valor del input de la carga de imagen luego de subida.
            $(triggerInput).val("");

            setTimeout(() => {
              $(alert).find('[role="alert"]').animate({ opacity: 0 }, 300).remove(300);//Tiempo para remover alerta en ms.
            }, 3000);//Tiempo de permanencia de alerta en ms.
          } else {
            $(holder).find(".pic").attr("src", currentImg);
            //Alerta de error al intentar subir la imagen.
            $(alert).append(`
                <div class="alert alert-danger alert-dismissible hide" role="alert">
                    <i class="fa fa-times-circle text-danger mx-2"></i><strong>Error.</strong> Inténtelo de nuevo más tarde.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `
            ).removeClass("hide").hide().fadeIn(300);//Tiempo de aparición en ms.

            //Se limpia el valor del input de la carga de imagen luego de subida.
            $(triggerInput).val("");
            setTimeout(() => {
              $(alert).find('[role="alert"]').animate({ opacity: 0 }, 300).hide(300);//Tiempo para remover alerta en ms.
            }, 3000);//Tiempo de permanencia de alerta en ms.
          }
        }, 1500);//Tiempo de carga de img.
      };
    } else {
      //Alerta de error al intentar subir una imagen en formato no valido.
      $(alert).append(
        `<div class="alert alert-danger d-inline-block p-2 small" role="alert">Por favor, elija una imagen válida.</div>`
      );
      setTimeout(() => {
        $(alert).find('role="alert"').remove(300);//Tiempo para remover alerta en ms.
      }, 3000);//Tiempo de permanencia de alerta en ms.
    }
  });
}

//Funcion para validar campos del perfil y guardar datos en local.
function validateAndSaveData() {
  window.addEventListener('load', function () {

    //Obtiene el formulario para validar con pseudoclases de BS.
    var form = document.getElementById("userProfileData");

    form.addEventListener('submit', function (event) {

      event.preventDefault();
      event.stopPropagation();

      if (form.checkValidity() === false) {

        //Alerta de error al no poder validar todos los campos.
        setTimeout(function () {
          $('<div class="dangerAlert alert alert-danger">' +
            '<i class="fa fa-times-circle text-danger mx-2"></i>' +
            '<strong>Error.</strong> Corrija los campos señalados.' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '&times;</button></div>').hide().appendTo('#alertInfo').fadeIn(300);//Tiempo de aparición en ms.

          $(".alert").delay(3000).fadeOut(//Tiempo de permanencia de alerta en ms.
            "normal",
            function () {
              $(this).remove().fadeIn(300);//Tiempo para remover alerta en ms.
            }
          );
        }, 300);//Tiempo de espera hasta mostrar alerta.

        //Scroll automatico al nivel superior de la pagina para visualizar alerta.
        window.scrollTo(0, 0);

      } else {
        
        //Se guardan los nuevos datos de usuario.
        localStorage.setItem("userProfile", (JSON.stringify({
          userName: userFirstName.value,
          userLastNames: userLastNames.value,
          userEmail: userEmail.value,
          userPhone: userPhone.value,
          userDob: userDob.value,
          userDocument: userDocument.value,
          userBio: userBio.value
        })));

        //Alerta de exito al guardar nuevos datos de usuario.
        setTimeout(function () {
          $('<div class="successAlert alert alert-success">' +
            '<i class="fa fa-check-circle text-success mx-2"></i>' +
            '<strong>Éxito.</strong> Info del perfil actualizada.' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '&times;</button></div>').hide().appendTo('#alertInfo').fadeIn(300);//Tiempo de aparición en ms.

          $(".alert").delay(3000).fadeOut(//Tiempo de permanencia de alerta en ms.
            "normal",
            function () {
              $(this).remove().fadeIn(300);//Tiempo para remover alerta en ms.
            }
          );

          //Muestra los datos guardados en los inputs.
          showSavedData();

        }, 300);//Tiempo de espera hasta mostrar alerta.

        //Scroll automatico al page top para ver alerta.
        window.scrollTo(0, 0);
      }
      form.classList.add('was-validated');
    });
  });
}
  
//Funcion para mostrar todos los datos disponibles generados tras el login.
function showLoginUserData() {

  //Obtienen datos de usuario google y normal guardados en local.
  var userLogged = localStorage.getItem("userLogged");
  var gUserProfile = localStorage.getItem("googleUserProfile");

  //Control para mostrar email de usuario normal.
  if (userLogged) {

    userLogged = JSON.parse(userLogged);

    //Mail mostrado en el panel del perfil de usuario.
    profileEmail.innerText = userLogged.user;
    profileEmail.setAttribute("href", `mailto:${userLogged.user}`);

    //Mail mostrado en el input value del email.
    userEmail.value = userLogged.user;
  }

  //Control para mostrar email de usuario google.
  if (gUserProfile) {

    gUserProfile = JSON.parse(gUserProfile);

    //Google profile img mostrada en el perfil de usuario.
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

  //Obtienen los datos guardados en local con los datos ingresados.
  var userProfile = localStorage.getItem("userProfile");
  var userNewProfilePic = localStorage.getItem("newProfilePic");
  userProfile = JSON.parse(userProfile);

  //Muestra la info de usuario guardada en el panel de edición derecho.
  if (userProfile != null) {
    userFirstName.value = userProfile.userName;
    userLastNames.value = userProfile.userLastNames;
    userEmail.value = userProfile.userEmail;
    userPhone.value = userProfile.userPhone;
    userDob.value = userProfile.userDob;
    userDocument.value = userProfile.userDocument;
    userBio.value = userProfile.userBio;

    //Muestra la info guardada en el panel de info izquierdo.
    profileName.innerText = userProfile.userName + " " + userProfile.userLastNames;
    profileEmail.innerText = userProfile.userEmail;
    profileEmail.setAttribute("href", `mailto:${userProfile.userEmail}`);
    profilePhone.innerText = userProfile.userPhone;
    profilePhone.setAttribute("href", `https://api.whatsapp.com/send?phone=598${userProfile.userPhone}`);
    profileAge.innerText = getAge(userProfile.userDob) + " años";
    profileBio.innerText = userProfile.userBio;
  }
  //Muestra la nueva img guardada.
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

  //Muestra datos de usuario de Google.
  showLoginUserData();

  //Ejecuta validación y guardado de valores inputs.
  validateAndSaveData();

  //Muestra la información guardada en inputs.
  showSavedData();

  //Ejecuta cambio de img del perfil.
  changeProfilePicture();

  //Limplia campos no guardados.
  cleanFields();
});