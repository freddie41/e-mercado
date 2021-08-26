// Lista para llenar con los productos
var productsArray = [];

// Muestro todos los productos de la lista con su imagen, nombre, descripcion y precio
function showProductsList(array){

    let htmlContentToAppend = "";

    for(let item of array) {

        let product = item;

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                            <h4 class="mb-1">`+ product.name +`</h4>
                            <p>` + product.description + `</p>
                        </div>
                        <small class="text-muted">` + product.currency + ` ` + product.cost + `</small>
                    </div>
                </div>
            </div>
        </div>
        `
        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    // Traer el listado de productos desde el json a traves de la url
    getJSONData(PRODUCTS_URL).then(function(resultObj){
        if (resultObj.status === "ok")
        {
            productsArray = resultObj.data;

            //Muestro las categorías ordenadas
            showProductsList(productsArray);
        }
    });
});