//Constantes para referenciar el criterio de ordenamiento elegido.
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";

//Variable para control de tipo de filtro de ordenamiento elegido.
var currentSortCriteria = undefined;

//Variables de control de ingreso para el filtro de min y max $.
var minCount = undefined;
var maxCount = undefined;

//Variable para control de categorias encontradas por el campo de busqueda.
var foundCategories = undefined;

//Lista para llenar con las categorias obtenidas del endpoint.
var currentCategoriesArray = [];


//Función para ordenar las categorias en base a los criterios:
//*Ascendente y descendente en base a la cantidad de productos por categoria.
//*Descendente en base a la relevancia (cant. de prod. vendidos)
function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

//Funcion para ver productos de la lista en formato grilla.
function showCategoriesGrid() {

    let htmlContentToAppend = "";

    for (let item of currentCategoriesArray) {

        let category = item;

        // Control para modificar el listado a mostrar aplicando el filtro por precio minimo y maximo
        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {

            if (foundCategories == undefined ||
                category.name.toLowerCase().indexOf(foundCategories) != -1 ||
                category.description.toLowerCase().indexOf(foundCategories) != -1) {

                htmlContentToAppend += `
                <div class="col-12 col-md-6 col-lg-4">
                    <a href="category-info.html" class="card mb-3 custom-card">
                        <div> 
                            <img class="bd-placeholder-img card-img-top" src="${category.imgSrc}">
                            <h4 class="m-3">${category.name}</h4>
                        </div>
                        <div class="card-body pt-0">
                            <p class="card-text">${category.description}</p>
                            <div class="row align-items-center">
                                <div class="col-6 text-left">
                                </div>
                                <div class="col-6 text-info text-right">${category.productCount} artículos</div>
                            </div>
                        </div>
                    </a>
                </div>
                `
            }
        }

        document.getElementById("cat-grid-container").innerHTML = htmlContentToAppend;
    }
}

//Funcion para ver categorias de productos en formato lista.
function showCategoriesList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentCategoriesArray.length; i++) {

        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {

            if (foundCategories == undefined ||
                category.name.toLowerCase().indexOf(foundCategories) != -1 ||
                category.description.toLowerCase().indexOf(foundCategories) != -1) {

                htmlContentToAppend += `
                <a href="category-info.html" class="list-group-item list-group-item-action">
                    <div class="row">
                        <div class="col-3">
                            <img src="${category.imgSrc}" alt="${category.name}" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="row d-flex">
                                <div class="col-9">
                                    <h4 class="mb-2">${category.name}</h4>
                                    <div>${category.description}</div>
                                </div>
                                <div class="col-3">
                                    <p class="text-info text-right my-1">${category.productCount} artículos</p>
                                </div>
                            </div>
                            <div class="row d-flex">
                                <div class="col text-right mt-2">
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
                `
            }
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

//Función para mostrar categorias ordenadas por criterio elegido.
function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro los productos ordenadados en formato de grilla.
    showCategoriesGrid();
    showCategoriesList();
}

//Funcion que activa ver listado de productos en formato grilla.
function showListView() {
    document.getElementById("showList").addEventListener("click", function () {
        showCategoriesList()
        document.getElementById("showGridCol").classList.add("d-none");
        document.getElementById("showListCol").classList.remove("d-none");
    });
}

//Funcion que activa ver listado de productos en formato lista.
function showGridView() {
    document.getElementById("showGrid").addEventListener("click", function () {
        document.getElementById("showGridCol").classList.remove("d-none");
        document.getElementById("showListCol").classList.add("d-none");
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
            from: "categories.html",
            msg: "Debes iniciar sesión para acceder a las categorías."
        }));
        window.location = "login.html";
    }

    //Trae el listado de categorias del endpoint.
    getJSONData(CATEGORIES_URL).then(function (resultObj) {

        if (resultObj.status === "ok") {
            
            //Muestra categorias ordenadas por relevancia.
            sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);

            //Inicializador de btns para seleccionar vista de lista o grilla.
            showListView();
            showGridView();

            //Evento de esucha de input para ejecutar la funcion de busqueda por palabra clave.
            document.getElementById("search").addEventListener("input", function () {

                foundCategories = document.getElementById("search").value.toLowerCase();
    
                showCategoriesGrid();
                showCategoriesList();
            });

            //Eventos de escucha con clic en btns para ejecutar funciones de orden.
            document.getElementById("sortAsc").addEventListener("click", function() {
                sortAndShowCategories(ORDER_ASC_BY_NAME);
            });
        
            document.getElementById("sortDesc").addEventListener("click", function() {
                sortAndShowCategories(ORDER_DESC_BY_NAME);
            });
        
            document.getElementById("sortByCount").addEventListener("click", function() {
                sortAndShowCategories(ORDER_BY_PROD_COUNT);
            });
        
            //Evento de escucha con clic en btn para filtrar por cantidad min. y max.
            document.getElementById("rangeFilterCount").addEventListener("click", function() {
              
                //Obtiene los valores ingresados para mín. y máx. de los intervalos.
                minCount = document.getElementById("rangeFilterCountMin").value;
                maxCount = document.getElementById("rangeFilterCountMax").value;

                //Control para parsear valor de cantidad, en caso que se ingrese, de string a valor numérico.
                if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
                    minCount = parseInt(minCount);
                } else {
                    minCount = undefined;
                }
        
                if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
                    maxCount = parseInt(maxCount);
                } else {
                    maxCount = undefined;
                }
        
                showCategoriesGrid();
                showCategoriesList();
            });

            //Evento de escucha con clic en btn para limpiar campos de filtros.
            document.getElementById("clearFilters").addEventListener("click", function() {
                document.getElementById("rangeFilterCountMin").value = "";
                document.getElementById("rangeFilterCountMax").value = "";
                document.getElementById("search").value = "";
        
                minCount = undefined;
                maxCount = undefined;

                foundCategories = undefined;
        
                showCategoriesGrid();
                showCategoriesList();
            });
        }
    });
});