//Constantes para referenciar el criterio de ordenamiento elegido.
const ORDER_ASC_BY_COST = "Menor precio";
const ORDER_DESC_BY_COST = "Mayor precio";
const ORDER_BY_PROD_RELEVANCE = "Relevancia";

//Variables de control de ingreso para el filtro de min y max $.
var minCost = undefined;
var maxCost = undefined;

//Variable para control de tipo de filtro de ordenamiento elegido.
var currentSortCriteria = undefined;

//Variable para control de productos encontrados por el campo de busqueda.
var foundProducts = undefined;

//Lista para llenar con los productos obtenidos del endpoint.
var currentProductsArray = [];

//Lista para guardar nuevos articulos agregados al carrito.
var newCartArtsArray = [];

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

//Función para ordenar los productos en base a los criterios:
//*Ascendente y descendente en base al precio.
//*Descendente en base a la relevancia (cant. de prod. vendidos)
function sortProducts(criteria, array) {

    let result = [];

    if (criteria === ORDER_ASC_BY_COST) {

        result = array.sort(function (a, b) {
            if (a.cost < b.cost) {
                return -1;
            }
            if (a.cost > b.cost) {
                return 1;
            }
            return 0;
        });

    } else if (criteria === ORDER_DESC_BY_COST) {

        result = array.sort(function (a, b) {
            if (a.cost > b.cost) {
                return -1;
            }
            if (a.cost < b.cost) {
                return 1;
            }
            return 0;
        });

    } else if (criteria === ORDER_BY_PROD_RELEVANCE) {

        result = array.sort(function (a, b) {
            let aSoldCount = a.soldCount;
            let bSoldCount = b.soldCount;

            if (aSoldCount > bSoldCount) {
                return -1;
            }
            if (aSoldCount < bSoldCount) {
                return 1;
            }
            return 0;
        });
    }

    return result;
}

//Funcion para ver la pagina de info de producto al cliquear en una de las opciones.
function setProductInfo (id) {
    localStorage.setItem("productID", JSON.stringify({
        productID: id,
    }));
    window.location = "product-info.html";
}

//Funcion para ver productos de la lista en formato grilla.
function showProductsGrid() {

    let htmlContentToAppend = "";

    for (let item of currentProductsArray) {

        let product = item;

        // Control para modificar el listado a mostrar aplicando el filtro por precio minimo y maximo
        if (((minCost == undefined) || (minCost != undefined && product.cost >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && product.cost <= maxCost))) {

            if (foundProducts == undefined ||
                product.name.toLowerCase().indexOf(foundProducts) != -1 ||
                product.description.toLowerCase().indexOf(foundProducts) != -1) {

                htmlContentToAppend += `
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card mb-3 custom-card">
                        <div onclick="setProductInfo('${product.id}');" style="cursor: pointer;"> 
                            <img class="bd-placeholder-img card-img-top" src="${product.imgSrc}">
                            <h4 class="m-3">${product.name}</h4>
                        </div>
                        <div class="card-body pt-0">
                            <p class="card-text">${product.description}</p>
                            <div class="row align-items-center">
                                <div class="col-7 text-left">
                                    <button type="button" class="btn btn-info btn-sm" onclick="addProdtoCart(${product.id},'${product.name}', '${product.cost}', '${product.currency}', '${product.imgSrc}')">Agregar al carrito</button>
                                </div>
                                <div class="col-5 text-info text-right">${product.currency + " " + product.cost}</div>
                            </div>
                        </div>
                    </div>
                </div>
                `
            }
        }

        document.getElementById("product-grid-container").innerHTML = htmlContentToAppend;
    }
}

//Funcion para ver productos de la lista en formato lista.
function showProductsList() {
    
    let htmlContentToAppend = "";

    for (let item of currentProductsArray) {

        let product = item;

        // Control para modificar el listado a mostrar aplicando el filtro por precio minimo y maximo
        if (((minCost == undefined) || (minCost != undefined && product.cost >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && product.cost <= maxCost))) {

            if (foundProducts == undefined ||
                product.name.toLowerCase().indexOf(foundProducts) != -1 ||
                product.description.toLowerCase().indexOf(foundProducts) != -1) {

                htmlContentToAppend += `
                <div class="list-group-item list-group-item-action">
                    <div class="row">
                        <div class="col-3 onclick="setProductInfo('${product.id}');" style="cursor: pointer;">
                            <img src="${product.imgSrc}" alt="${product.description}" class="img-thumbnail">
                        </div>
                        <div class="col">
                            <div class="row d-flex">
                                <div class="col-9" onclick="setProductInfo('${product.id}');" style="cursor: pointer;">
                                    <h4 class="mb-2">${product.name}</h4>
                                    <div>${product.description}</div>
                                </div>
                                <div class="col-3">
                                    <p class="text-info text-right my-1">${product.currency + " " + product.cost}</p>
                                </div>
                            </div>
                            <div class="row d-flex">
                                <div class="col text-right mt-2">
                                    <button type="button" class="btn btn-info btn-sm" onclick="addProdtoCart(${product.id},'${product.name}', '${product.cost}', '${product.currency}', '${product.imgSrc}')">Agregar al carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
            }
        }
        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
}

//Funcion para agregar producto al carrito.
function addProdtoCart(id, name, cost, currency, image) {

    //Agrega un nuevo producto como objeto al array de productos para el carrito.
    newCartArtsArray.push(
        {
            id: parseInt(id),
            name: name,
            count: 1,
            unitCost: parseInt(cost),
            currency: currency,
            src: image
        }
    );
    //Guarda los cambios del array en un nuevo objeto en local.
    localStorage.setItem('newCartArts', (JSON.stringify(
        {
            articles: newCartArtsArray
        }
    )));
    //Alerta de confirmación de tipo modal SweetAlert2 al agregar producto al carrito.
    swalBSCancelAcceptButtons.fire({
        title: '¡Éxito!',
        text: "Producto agregado al carrito.",
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Ver carrito',
        cancelButtonText: 'Continuar comprando',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            window.location = "cart.html";//Redirige al la pagina de carrito.
        }
    });
}

//Función para mostrar productos ordenados por criterio elegido.
function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenadados en formato de grilla.
    showProductsGrid();
    showProductsList();
}

//Funcion que activa ver listado de productos en formato grilla.
function showListView() {
    document.getElementById("showList").addEventListener("click", function () {
        showProductsList();
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
            from: "products.html",
            msg: "Debes iniciar sesión para acceder al listado de productos."
        }));
        window.location = "login.html";
    }

    //Trae el listado de productos del endpoint.
    getJSONData(PRODUCTS_URL).then(function (resultObj) {

        if (resultObj.status === "ok") {
            
            //Muestra productos ordenados por relevancia.
            sortAndShowProducts(ORDER_BY_PROD_RELEVANCE, resultObj.data);

            //Inicializador de btns para seleccionar vista de lista o grilla.
            showListView();
            showGridView();
        
            //Evento de esucha de input para ejecutar la funcion de busqueda por palabra clave.
            document.getElementById("search").addEventListener("input", function () {

            foundProducts = document.getElementById("search").value.toLowerCase();

            showProductsGrid();
            showProductsList();
            });

            //Eventos de escucha con clic en btns para ejecutar funciones de orden.
            document.getElementById("sortAscCost").addEventListener("click", function () {
                sortAndShowProducts(ORDER_ASC_BY_COST);
            });
            document.getElementById("sortDescCost").addEventListener("click", function () {
                sortAndShowProducts(ORDER_DESC_BY_COST);
            });
            document.getElementById("sortByRelevance").addEventListener("click", function () {
                sortAndShowProducts(ORDER_BY_PROD_RELEVANCE);
            });

            //Evento de escucha con clic en btn para filtrar por precio min. y max.
            document.getElementById("rangeFilterCost").addEventListener("click", function () {

                //Obtiene los valores ingresados para mín. y máx. de los intervalos.
                minCost = document.getElementById("rangeFilterMinCost").value;
                maxCost = document.getElementById("rangeFilterMaxCost").value;

                //Control para parsear valor de costo, en caso que se ingrese, de string a valor numérico.
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
                showProductsGrid();
                showProductsList();
            });
    
            //Evento de escucha con clic en btn para limpiar campos de filtros.
            document.getElementById("clearFilters").addEventListener("click", function () {
                document.getElementById("rangeFilterMinCost").value = "";
                document.getElementById("rangeFilterMaxCost").value = "";
                document.getElementById("search").value = "";

                minCost = undefined;
                maxCost = undefined;

                foundProducts = undefined;

                showProductsGrid();
                showProductsList();
            });
        }
    });
});