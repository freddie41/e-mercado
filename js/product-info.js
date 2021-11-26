//URL base para construir el nombre del archivo JSON.
var PRODUCT_INFO = "https://freddie41.github.io/e-mercado.sandbox/cars_api/";

//Objeto para guardar la info de productos del endpoint.
var productInfo = {};

//Array para guardar la lista de productos del endpoint.
var productsList = [];

//Función para mostrar un carousel de imágenes.
function showCarousel(id, array) {

    var html = $("#" + id).append(`
    <ol class="carousel-indicators"></ol>
    <div class="carousel-inner" role="listbox"></div>
    <a class="carousel-control-prev" href="#${id}" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true">
        </span><span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#${id}" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true">
        </span><span class="sr-only">Next</span>
    </a>
    `);

    let indicatorItem = html.find('.carousel-indicators');
    let carouselItem = html.find('.carousel-inner');

    array.forEach((image, indicator) => {

        var activeclass = indicator == 0 ? "active" : "";

        indicatorItem.append(`
        <li data-target="#${id}" data-slide-to="${indicator}" class="${activeclass}"></li>
        `);

        carouselItem.append(`
        <div class="carousel-item ${activeclass}">
            <picture>
                <source srcset="${image}" media="(min-width: 1400px)">
                <source srcset="${image}" media="(min-width: 769px)">
                <source srcset="${image}" media="(min-width: 577px)">
                <img srcset="${image}" alt="responsive image" class="d-block img-responsive">
            </picture>
        </div>
        `);
    });
}

//Función para mostrar los comentarios y rating 
function showCommentsList(commentsList) {

    let htmlContentToAppend = document.getElementById("commentsList").innerHTML;

    for (let item of commentsList) {

        let comment = item;

        //Control para definir el rating de cada comentario en base al valor del endpoint.
        let starRating = [
            comment.score >= 1 ? "checked" : "",
            comment.score >= 2 ? "checked" : "",
            comment.score >= 3 ? "checked" : "",
            comment.score >= 4 ? "checked" : "",
            comment.score >= 5 ? "checked" : "",
        ];

        htmlContentToAppend += `
        <div class="row mb-4">
            <div class="col-sm-12">
                <div class="card ">
                    <div class="card-header">
                        <strong>${comment.user}</strong>
                        <div class="star-rating">
                            <span class="fa fa-star ${starRating[0]}"></span>
                            <span class="fa fa-star ${starRating[1]}"></span>
                            <span class="fa fa-star ${starRating[2]}"></span>
                            <span class="fa fa-star ${starRating[3]}"></span>
                            <span class="fa fa-star ${starRating[4]}"></span>
                        </div><br>
                        <div class="text-muted">${(new Date(comment.dateTime)).toLocaleString()}</div>
                    </div>
                    <div class="card-body">${comment.description}</div>
                </div>
            </div>
        </div>
        `
    }
    document.getElementById("commentsList").innerHTML = htmlContentToAppend;
}

//Función para obtener valor de rating.
function getStarRating() {

    var stars = document.getElementsByName("rating");

    for (item of stars) {
        if (item.checked) {
            return item.value;
        }
    }
    return 0;
}

//Función para limpiar inputs y rating de comentario nuevo.
function cleanCommentAndRating() {
    document.getElementById("commentText").value = "";
    document.getElementById("star-1").checked = false;
    document.getElementById("star-2").checked = false;
    document.getElementById("star-3").checked = false;
    document.getElementById("star-4").checked = false;
    document.getElementById("star-5").checked = false;
}

//Función para mostrar usuario que genera comentario nuevo.
function showUserLogged() {

    //Obtienen datos de usuario google y normal guardados en local.
    var userLogged = localStorage.getItem("userLogged");
    var googleUserProfile = localStorage.getItem("googleUserProfile");
    var user = document.getElementById("user");

    //Control para mostrar email de usuario normal.
    if (userLogged) {
        userLogged = JSON.parse(userLogged);
        user = userLogged.user;
        return user;
    }
    //Control para mostrar email de usuario google.
    if (googleUserProfile) {
        googleUserProfile = JSON.parse(googleUserProfile);
        googleUserEmail = googleUserProfile.gUserFullName;
        user = googleUserEmail;
        return user;
    }
}

//Función para publicar nuevo comentario y rating.
function publishComment() {
    showCommentsList([
        {
            "score": getStarRating(),
            "description": document.getElementById("commentText").value,
            "user": showUserLogged(),
            "dateTime": new Date().getTime()
        }
    ]);
    //Se ejecuta para limpiar el input y rating luego de ingresar un comentario nuevo.
    cleanCommentAndRating();
}

//Función para mostrar productos relacionados.
function showRelatedProducts(productsList, relatedProducts) {

    let htmlContentToAppend = "";

    for (let item of productsList) {

        let product = item;

        if (relatedProducts.indexOf(item.id) !== -1) {

            htmlContentToAppend += `
            <div class="card" id="relatedProdCards" onclick="setProductInfo('${product.id}');">
                <img src="${product.imgSrc}" class="card-img-top" alt="${product.description}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                </div>
            </div>
            `
        }
    }
    document.getElementById("card-deck").innerHTML = htmlContentToAppend;
}

//Funcion para ver la pagina de info de producto al cliquear en una de las opciones de productos relacionados.
function setProductInfo(id) {
    localStorage.setItem("productID", JSON.stringify({ productID: id }));
    window.location = "product-info.html";
}

//Función para mostrar info del producto segun el ID guardado en local.
function showProductInfo(productID) {

    getJSONData(PRODUCT_INFO + productID + ".json").then(function (resultObj) {

        if (resultObj.status === "ok") {

            productInfo = resultObj.data;

            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCategoryHTML = document.getElementById("productCategory");
            let productCostHTML = document.getElementById("productCost");

            productNameHTML.innerHTML = productInfo.name;
            productDescriptionHTML.innerHTML = productInfo.description;
            productCategoryHTML.innerHTML = productInfo.category;
            productCostHTML.innerHTML = productInfo.currency + " " + productInfo.cost;

            //Muestra imagenes de producto en formato carrusel.
            showCarousel("carouselIndicators", productInfo.images);

            //Trae listado de comentarios desde el endpoint.
            getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {

                if (resultObj.status === "ok") {

                    //Muestra el listado de comentarios.
                    showCommentsList(resultObj.data);

                    //Trea el listado de productos desde el endpoint.
                    getJSONData(PRODUCTS_URL).then(function (resultObj) {

                        if (resultObj.status === "ok") {

                            productsList = resultObj.data;

                            //Muestra los productos relacionados.
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

    //Trae el usuario logueado.
    let userLogged = localStorage.getItem("userLogged");
    let googleUserLogged = localStorage.getItem("googleUserProfile");

    //Control para validar que el usuario haya hecho login.
    if (!userLogged && !googleUserLogged) {
        localStorage.setItem("login-need", JSON.stringify({
            from: "product-info.html",
            msg: "Debes iniciar sesión para acceder a la info del producto."
        }));
        window.location = "login.html";
    }

    //Trae el ID de producto almacenado en local. 
    var product = JSON.parse(localStorage.getItem("productID"));

    //Muestra el listado de productos.
    showProductInfo(product.productID);
});