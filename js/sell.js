let productCost = 0;
let productCount = 0;
let comissionPercentage = 0.13;
let MONEY_SYMBOL = "$";
let DOLLAR_CURRENCY = "Dólares (USD)";
let PESO_CURRENCY = "Pesos Uruguayos (UYU)";
let DOLLAR_SYMBOL = "USD ";
let PESO_SYMBOL = "UYU ";
let PERCENTAGE_SYMBOL = '%';

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

//Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts(){
    let unitProductCostHTML = document.getElementById("productCostText");
    let comissionCostHTML = document.getElementById("comissionText");
    let totalCostHTML = document.getElementById("totalCostText");

    let unitCostToShow = MONEY_SYMBOL + productCost;
    let comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL;
    let totalCostToShow = MONEY_SYMBOL + (Math.round(productCost * comissionPercentage * 100) / 100);

    unitProductCostHTML.innerHTML = unitCostToShow;
    comissionCostHTML.innerHTML = comissionToShow;
    totalCostHTML.innerHTML = totalCostToShow;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

    //Trae el usuario logueado.
    let userLogged = localStorage.getItem("userLogged");
    let googleUserLogged = localStorage.getItem("googleUserProfile");

    //Control para validar que el usuario haya hecho login.
    if (!userLogged && !googleUserLogged) {
        localStorage.setItem("login-need", JSON.stringify({
            from: "sell.html",
            msg: "Debes iniciar sesión para acceder a la pagina de venta de artículos."
        }));
        window.location = "login.html";
    }

    document.getElementById("productCountInput").addEventListener("change", function(){
        productCount = this.value;
        updateTotalCosts();
    });

    document.getElementById("productCostInput").addEventListener("change", function(){
        productCost = this.value;
        updateTotalCosts();
    });

    document.getElementById("goldradio").addEventListener("change", function(){
        comissionPercentage = 0.13;
        updateTotalCosts();
    });
    
    document.getElementById("premiumradio").addEventListener("change", function(){
        comissionPercentage = 0.07;
        updateTotalCosts();
    });

    document.getElementById("standardradio").addEventListener("change", function(){
        comissionPercentage = 0.03;
        updateTotalCosts();
    });

    document.getElementById("productCurrency").addEventListener("change", function(){
        if (this.value == DOLLAR_CURRENCY)
        {
            MONEY_SYMBOL = DOLLAR_SYMBOL;
        } 
        else if (this.value == PESO_CURRENCY)
        {
            MONEY_SYMBOL = PESO_SYMBOL;
        }

        updateTotalCosts();
    });

    //Configuraciones para el elemento que sube archivos
    var dzoptions = {
        url:"/",
        autoQueue: false
    };
    var myDropzone = new Dropzone("div#file-upload", dzoptions);    


    //Se obtiene el formulario de publicación de producto
    var sellForm = document.getElementById("sell-info");

    //Se agrega una escucha en el evento 'submit' que será
    //lanzado por el formulario cuando se seleccione 'Vender'.
    sellForm.addEventListener("submit", function(e){

        let productNameInput = document.getElementById("productName");
        let productCategory = document.getElementById("productCategory");
        let productCost = document.getElementById("productCostInput");
        let infoMissing = false;

        //Quito las clases que marcan como inválidos
        productNameInput.classList.remove('is-invalid');
        productCategory.classList.remove('is-invalid');
        productCost.classList.remove('is-invalid');

        //Se realizan los controles necesarios,
        //En este caso se controla que se haya ingresado el nombre y categoría.
        //Consulto por el nombre del producto
        if (productNameInput.value === "")
        {
            productNameInput.classList.add('is-invalid');
            infoMissing = true;
        }
        
        //Consulto por la categoría del producto
        if (productCategory.value === "")
        {
            productCategory.classList.add('is-invalid');
            infoMissing = true;
        }

        //Consulto por el costo
        if (productCost.value <=0)
        {
            productCost.classList.add('is-invalid');
            infoMissing = true;
        }
        
        //Aquí ingresa si pasó los controles, irá a enviar
        //la solicitud para crear la publicación.
        if (!infoMissing) {

            //Alerta de confirmación de tipo modal al crear publicacion con exito.
            swalBSStandardBtn.fire({
                title: '¡Éxito!',
                html: 'El artículo fue publicado.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });

        } else {

            //Alerta de error de tipo modal SweetAlert2 al no poder validar la publicacion.
            swalBSStandardBtn.fire({
                title: '¡Ups!',
                html: 'Datos de ingreso inválidos.<br>Corrija los campos señalados.',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
            });
        }

        //Esto se debe realizar para prevenir que el formulario se envíe (comportamiento por defecto del navegador)
        if (e.preventDefault) e.preventDefault();
            return false;
    });
});