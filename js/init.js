const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://freddie41.github.io/e-mercado.sandbox/cars_api/cars.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_INFO_URL_ARRAY = "https://freddie41.github.io/e-mercado.sandbox/cars_api/cart-preset.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
  var result = {};
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
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

//Funcion que activa/desactiva el offcanvas sidebar
function offCanvasInit() {
  
  $(document).ready(function() {
 
      $('.dismiss, .overlay').on('click', function() {
          $('.sidebar').removeClass('active');
          $('.overlay').removeClass('active');
      });
   
      $('.open-menu').on('click', function(e) {
          e.preventDefault();
          setTimeout(function(){
            $('.sidebar').addClass('active');
          }, 100);
          $('.overlay').addClass('active');
          // close opened sub-menus
          $('.collapse.show').toggleClass('show');
          $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
  });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

  //Inicializador del componente.
  offCanvasInit();

  //Get User/googleUser data
  var userLogged = localStorage.getItem("userLogged");
  var gUserProfile = localStorage.getItem("googleUserProfile");

  //Get offcanvas and navbar user data fields
  var userNavbar = document.getElementById("user");
  var userOffcanvas = document.getElementById("user-sm");

  //Control para mostrar user logged o google user logged.
  if (userLogged) {
    
    userLogged = JSON.parse(userLogged);

    //Email mostrado en el navbar.
    userNavbar.innerText = "Hola," + " " + userLogged.user;

    //Mail mostrado en el offcanvas.
    userOffcanvas.innerText = "Hola," + " " + userLogged.user;
  }

  if (gUserProfile) {
    
    gUserProfile = JSON.parse(gUserProfile);

    //Google name mostrado en el navbar.
    userNavbar.innerText = "Hola," + " " + gUserProfile.gUserName;

    //Google name mostrado en el offcanvas.
    userOffcanvas.innerText = "Hola," + " " + gUserProfile.gUserName;
  }
});