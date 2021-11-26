//Endpoints con datos en formato JSON.
const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://freddie41.github.io/e-mercado.sandbox/cars_api/cars.json";
const PRODUCT_INFO_URL = "https://freddie41.github.io/e-mercado.sandbox/cars_api/";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://freddie41.github.io/e-mercado.sandbox/cars_api/cart-preset.json";

//Funciones para mostrar y ocultar spinners de carga.
var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}
var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

//Funcion para fetchear la información de los endpoints.
var getJSONData = function (url) {
  var result = {};
  //Muestra el spinner mientras se carga la data.
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      //Oculta el spinner cuando la data ha sido cargada por completo.
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      //Oculta el spinner mientras se intenta cargar la data.
      hideSpinner();
      return result;
    });
}

//Funcion que muestra y oculta el sidebar de tipo offcanvas.
function offCanvasInit() {
  $(document).ready(function() {
      $('.dismiss, .overlay').on('click', function() {
          $('.sidebar').removeClass('active');
          $('.overlay').removeClass('active');
      });
      //Abre el sidebar.
      $('.open-menu').on('click', function(e) {
          e.preventDefault();
          setTimeout(function(){
            $('.sidebar').addClass('active');
          }, 100);
          $('.overlay').addClass('active');
          //Cierra el sidebar.
          $('.collapse.show').toggleClass('show');
          $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
  });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

  //Inicializador del sidebar.
  offCanvasInit();

  //Obtiene los emails del tipo de usuario ingresado.
  var userLogged = localStorage.getItem("userLogged");
  var gUserProfile = localStorage.getItem("googleUserProfile");

  //Obtiene los campos de email de usuario en sidebar y navbar.
  var userNavbar = document.getElementById("user");
  var userOffcanvas = document.getElementById("user-sm");

  //Control para mostrar info de usuario normal.
  if (userLogged) {
    
    userLogged = JSON.parse(userLogged);

    //Email mostrado en el navbar.
    userNavbar.innerText = "Hola," + " " + userLogged.user;

    //Email mostrado en el sidebar.
    userOffcanvas.innerText = "Hola," + " " + userLogged.user;
  }

  //Control para mostrar info de usuario google.
  if (gUserProfile) {
    
    gUserProfile = JSON.parse(gUserProfile);

    //Google name mostrado en el navbar.
    userNavbar.innerText = "Hola," + " " + gUserProfile.gUserName;

    //Google name mostrado en el sidebar.
    userOffcanvas.innerText = "Hola," + " " + gUserProfile.gUserName;
  }
});