var PRODUCT_INFO = "https://freddie41.github.io/e-mercado.sandbox/cars_api/";

var productInfo = {};

var productsList = [];

function showImagesGallery(array) {

    let htmlContentToAppend = "";

    for(let item of array) {
        
        let imageSrc = item;

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="`+ imageSrc +`" alt="">
            </div>
        </div>
        `

        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}

// Función para mostrar info de producto al cliquear en una de las opciones de la lista
function setProductInfo (id) {
    localStorage.setItem("productID", JSON.stringify({productID: id}));
    window.location = "product-info.html";
}

// Función para mostrar los comentarios y rating 
function showCommentsList(commentsList) {

    let htmlContentToAppend = document.getElementById("commentsList").innerHTML;

    for(let item of commentsList) {
        
        let comment = item;

        let starRating = [
            comment.score >= 1 ? "checked" : "",
            comment.score >= 2 ? "checked" : "",
            comment.score >= 3 ? "checked" : "",
            comment.score >= 4 ? "checked" : "",
            comment.score >= 5 ? "checked" : "",
        ];

        htmlContentToAppend += `
        <div class="row mb-4">
            <div class="col-sm-9">
                <div class="card ">
                    <div class="card-header">
                        <strong>`+ comment.user +`</strong>
                        <div class="star-rating">
                            <span class="fa fa-star `+ starRating[0] +`"></span>
                            <span class="fa fa-star `+ starRating[1] +`"></span>
                            <span class="fa fa-star `+ starRating[2] +`"></span>
                            <span class="fa fa-star `+ starRating[3] +`"></span>
                            <span class="fa fa-star `+ starRating[4] +`"></span>
                        </div><br>
                        <div class="text-muted">`+ (new Date(comment.dateTime)).toLocaleString() +`</div>
                    </div>
                    <div class="card-body">`+ comment.description +`</div>
                </div>
            </div>
        </div>
        `

        document.getElementById("commentsList").innerHTML = htmlContentToAppend;
    }
}

// Función para obtener el valor de rating de estrella al hacer clic sobre una de las opciones
function getStarRating() {

    var stars = document.getElementsByName("rating");

    for (item of stars){
        if (item.checked){
            return item.value;
        }
    }
    return 0;
}

// Función para limpiar los campos de entrada de texto y rating de un comentario nuevo
// al hacer clic sobre el boton cancelar
function cleanCommentAndRating() {
    document.getElementById("commentText").value = "";
    document.getElementById("star-1").checked = false;
    document.getElementById("star-2").checked = false;
    document.getElementById("star-3").checked = false;
    document.getElementById("star-4").checked = false;
    document.getElementById("star-5").checked = false;
}

// Función para mostrar el usuario que genera un comentario nuevo
function getUserLogged() {

    // User data y google user data
    var userLogged = localStorage.getItem("userLogged");
    var googleUserLogged = localStorage.getItem("googleUserLogged");
    var user = document.getElementById("user");
  
    // Control para mostrar user logged o google user logged
    if (userLogged) {
      userLogged = JSON.parse(userLogged);
      user = userLogged.user;
      return user;
    }
    if (googleUserLogged) {
      googleUserEmail = googleUserLogged;
      user = googleUserEmail;
      return googleUserEmail;
    }
}

// Función para publicar un nuevo comentario con rating
function publishComment() {
    showCommentsList([
        {
            "score": getStarRating(),
            "description": document.getElementById("commentText").value,
            "user": getUserLogged(),
            "dateTime": new Date().getTime()
        }
    ]);

    cleanCommentAndRating();
}

// Función para mostrar los productos relacionados en el carrusel
function showRelatedProducts(productsList, relatedProducts) {

    let htmlContentToAppend = "";

    for(let item of productsList) {

        let product = item;

        if (relatedProducts.indexOf(item.id) !== -1) {

            htmlContentToAppend += `
            <div class="card" id="relatedProdCards" onclick="setProductInfo('`+ product.id +`');">
                <img src="`+ product.imgSrc +`" class="card-img-top" alt="`+ product.description +`">
                <div class="card-body">
                    <h5 class="card-title">`+ product.name +`</h5>
                    <p class="card-text">`+ product.description +`</p>
                </div>
            </div>
            `
        }
        document.getElementById("card-deck").innerHTML = htmlContentToAppend;   
    }
}

// Función para mostrar la info del producto segun el ID guardado en localStorage
function showProductInfo (productID) {
    getJSONData(PRODUCT_INFO + productID + ".json").then(function(resultObj) {
        if (resultObj.status === "ok") {

            productInfo = resultObj.data;

            let productNameHTML  = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCategoryHTML = document.getElementById("productCategory");
            let productCostHTML = document.getElementById("productCost");
        
            productNameHTML.innerHTML = productInfo.name;
            productDescriptionHTML.innerHTML = productInfo.description;
            productCategoryHTML.innerHTML = productInfo.category;
            productCostHTML.innerHTML = productInfo.currency + " " + productInfo.cost;

            //Muestro las imagenes en forma de galería
            showImagesGallery(productInfo.images);

            // Trae el listado de comentarios desde el json a traves de la url y los muestra
            getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
            
                if (resultObj.status === "ok") {
                    
                    showCommentsList(resultObj.data);

                    // Trae el listado de productos para mostrar productos relacionados
                    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        
                        if (resultObj.status === "ok") {
        
                            productsList = resultObj.data;
        
                            //Muestro los productos relacionados en el carrusel
                            showRelatedProducts(productsList, productInfo.relatedProducts);
                        }
                    });
                }
            });
        }
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    // Importación del id almacenado al selecciponar el producto 
    var product = JSON.parse(localStorage.getItem("productID"));

    showProductInfo(product.productID);
});