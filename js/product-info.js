var PRODUCT_INFO = "https://freddie41.github.io/e-mercado.sandbox/cars_api/";

var product = {};

function showImagesGallery(array){

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

// Función para mostrar los comentarios y rating 
function showCommentsList(commentsList){

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
function getStarRating(){

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
function getUserLogged(){

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

    cleanCommentAndRating()
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    // Importación del id almacenado al selecciponar el producto 
    var product = JSON.parse(localStorage.getItem("productID"));

    showProductInfo(product.productID);

    // Trae el listado de comentarios desde el json a traves de la url y los muestra
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {

        if (resultObj.status === "ok") {

            showCommentsList(resultObj.data);
        }
    });
});