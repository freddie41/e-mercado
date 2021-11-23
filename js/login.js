//Trae los input para los datos de ingreso.
var password = $("#inputPassword");
var user = $("#inputUser");

//Config de btns de SweetAlert2 para mostrar btns de BS4.
var swalBSDeleteAcceptButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-danger mx-3 my-2',
        cancelButton: 'btn btn-secondary mx-3 my-2'
    },
    buttonsStyling: false
  });
  
  var swalBSCancelAcceptButtons = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-info mx-3 my-2',
        cancelButton: 'btn btn-secondary mx-3 my-2'
    },
    buttonsStyling: false
  });
  
  var swalBSStandardBtn = Swal.mixin({
    customClass: {
        confirmButton: 'btn btn-info mx-3 my-2',
    },
    buttonsStyling: false
  });

//Funcion para mostrar alerta de login invalido.
function showFailureAlert() {
    
    //Alerta de error de tipo modal SweetAlert2 al no poder validar los campos.
    swalBSStandardBtn.fire({
        title: '¡Ups!',
        html: 'Datos de ingreso inválidos.<br>Corrija los campos señalados.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
    });

      //Scroll automatico al nivel superior de la pagina para visualizar alerta.
      window.scrollTo(0, 0);
}

//Funcion para validar inputs de usuario y contraseña.
function validateEmptyFields() {

    //Bandera de validación.
    let validFields = true;

    //Control para que el campo usuario no quede vacio.
    if (user.val() == "") {

        validFields = false;
        user.addClass("is-invalid");
    }

    //Control para que el campo contraseña no quede vacio.
    if (password.val() == "") {

        validFields = false;
        password.addClass("is-invalid");

    }

    return validFields;
}

function validateLogin() {
    
    //Bandera de validación.
    let validLogin = true;

    //Expresion regular para validar email de usuario.
    var validEmail = new RegExp(/^([_a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@([a-zA-Z0-9-]+\.)+([a-zA-Z]{2,3})$/);

    //Expresion regular para validar contraseña.
    var validPassword = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/);

    //Control para validar estructura de email corracta.
    if (validEmail.test(user.val()) == false) {
        validLogin = false;
        user.addClass("is-invalid");

    } else {
        user.removeClass("is-invalid");
        user.addClass("is-valid");
    }

    //Control para validar estructura de contraseña correcta.
    if (validPassword.test(password.val()) == false) {
        validLogin = false;
        password.addClass("is-invalid");

    } else {
        password.removeClass("is-invalid");
        password.addClass("is-valid");
    }

    //Control para validar que los campos no se ingresen vacios.
    if (!validateEmptyFields()) {

        validLogin = false;
    }
    
    return validLogin;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
$(document).ready(function () {

    let loginNeed = localStorage.getItem("login-need");

    if (loginNeed) {
        loginNeed = JSON.parse(loginNeed);

        //Alerta de tipo modal SweetAlert2 para informar que el usuario necesita logearse.
        swalBSStandardBtn.fire({
            title: '¡Atención!',
            text: `${loginNeed.msg}`,
            icon: 'warning',
            confirmButtonText: 'Aceptar',
        });
    }

    //Inicializador de popovers.
    $('[data-toggle="popover"]').popover();
})
//Bindeo de evento al cliquear en btn ingresar y validar login.
.on("click", "#loginBtn", function () {
        
        //Control para validar el login correcto.
        if (validateLogin()) {

            //Guarda el email del usuario logeado para mostrar en navbar y sidebar.
            localStorage.setItem("userLogged", (JSON.stringify({
                
                user: user.val()
            }
            )));

            //Alerta de confirmación del borrado de tipo modal SweetAlert2.
            swalBSStandardBtn.fire({
                title: '¡Éxito!',
                text: 'Datos de ingreso correctos.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500
            });

            
            let loginNeed = localStorage.getItem("login-need");
            
            //Control para redirigir a la pagina solicitada previo a estar logeado.
            if (loginNeed) {

                loginNeed = JSON.parse(loginNeed);

                //Tiempo de espera hasta redirigir.
                setTimeout(function () {
                    
                    localStorage.removeItem("login-need");
                    window.location = loginNeed.from;

                }, 2500);//Tiempo en ms.

            } else {
                
                //Tiempo de espera hasta redirigir.
                setTimeout(function () {
                    
                    //Redirige al inicio por defecto.
                    window.location = "index.html";
                }, 2500);
            }
        } else {
            //Muestra alerta de campos inválidos.
            showFailureAlert();
        }
})