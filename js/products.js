// Constantes para referenciar el criterio de ordenamiento elegido
const ORDER_ASC_BY_COST = "Menor precio";
const ORDER_DESC_BY_COST = "Mayor precio";
const ORDER_BY_PROD_RELEVANCE = "Relevancia";

// Variables de control de ingreso para el filtro de min y max $$$
var minCost = undefined;
var maxCost = undefined;

// Variable para control de tipo de filtro de ordenamiento elegido
var currentSortCriteria = undefined;

// Lista para llenar con los productos y propiedades
var currentProductsArray = [];

// Función para ordenar los productos en base a los criterios:
// * Ascendente y descendente en base al precio.
// * Descendente en base a la relevancia (cant. de prod. vendidos)
function sortProducts(criteria, array){
    
    let result = [];
    
    if (criteria === ORDER_ASC_BY_COST) {

        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ) {
                return -1;
            }
            if ( a.cost > b.cost ) {
                return 1;
            }
            return 0;
        });
        
    }else if (criteria === ORDER_DESC_BY_COST) {

        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ) {
                return -1;
            }
            if ( a.cost < b.cost ) {
                return 1;
            }
            return 0;
        });

    }else if (criteria === ORDER_BY_PROD_RELEVANCE) {

        result = array.sort(function(a, b) {
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if ( aSoldCount > bSoldCount ) {
                return -1;
            }
            if ( aSoldCount < bSoldCount ) {
                return 1;
            }
            return 0;
        });
    }

    return result;
}

// Muestro todos los productos de la lista con su imagen, nombre, descripcion y precio
function showProductsList() {

    let htmlContentToAppend = "";

    for (let item of currentProductsArray) {

        let product = item;

        // Control para modificar el listado a mostrar aplicando el filtro por precio minimo y maximo
        // FALTA CONTEMPLAR EL CASO DE INGRESAR UN minCost mayor a un existente de la lista
        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))) {

            htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                            <h4 class="mb-1">`+ product.name + `</h4>
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
}

// Función para mostrar los productos ordenados por el criterio elegido
function sortAndShowProducts (sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenadados
    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    // Traer el listado de productos desde el json a traves de la url
    // y los ordena por relevancia
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_BY_PROD_RELEVANCE, resultObj.data);
        }
    });

    // Importación de btns de tipo de orden para invocar a la función
    // correspondiente al criterio parametrizado al hacer click en cada btn
    document.getElementById("sortAscCost").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDescCost").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByrRelevance").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_RELEVANCE);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterMinCost").value = "";
        document.getElementById("rangeFilterMaxCost").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCost").addEventListener("click", function () {

        //Obtengo los valores ingresados para mínimo y máximo de los intervalos
        minCost = document.getElementById("rangeFilterMinCost").value;
        maxCost = document.getElementById("rangeFilterMaxCost").value;

        // Control para tranformar el valor de costo, en caso que se ingrese, de string a valor numérico
        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0) {
            minCost = parseInt(minCost);
        }
        else {
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0) {
            maxCost = parseInt(maxCost);
        }
        else {
            maxCost = undefined;
        }

        showProductsList();
    });
});