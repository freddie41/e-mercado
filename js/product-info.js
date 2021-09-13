var PRODUCT_INFO = "https://freddie41.github.io/e-mercado.sandbox/cars_api/";

var product = {};

function showImagesGallery(array){

    let htmlContentToAppend = "";

    for(let item of array) {
        
        let imageSrc = item;

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `

        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}

// Función para mostrar la info del producto segun el ID guardado en localStorage
function showProductInfo (productID) {
    getJSONData(PRODUCT_INFO + productID + ".json").then(function(resultObj){
        if (resultObj.status === "ok")
        {
            product = resultObj.data;

            let productNameHTML  = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCategoryHTML = document.getElementById("productCategory");
            let productCostHTML = document.getElementById("productCost");
        
            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCategoryHTML.innerHTML = product.category;
            productCostHTML.innerHTML = product.currency + " " + product.cost;

            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
        }
    });
}

function showProductComments () {
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            productComments = resultObj.data;

            let commentDescriptionHTML = document.getElementById("productDescription");
            let commentUserHTML = document.getElementById("productCategory");
            let commentDateHTML = document.getElementById("productCost");
        
            commentDescriptionHTML.innerHTML = productComments.description;
            commentUserHTML.innerHTML = productComments.user;
            commentDateHTML.innerHTML = productComments.dateTime;

            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
        }
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

  // Importación del id almacenado al selecciponar el producto 
  var product = JSON.parse(localStorage.getItem("productID"));

    showProductInfo(product.productID);
});