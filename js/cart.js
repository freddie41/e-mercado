//Variable para almancenar el arreglo obtenido al llamar al endpoint
var cartPoruducts = [];

//Valor de la cotización del USD
var conversionValueUSD = 40;

//Controles para sumar/restar cantidad de articulos agregados al carrito
function itemCountControls() {
  
  $('.btn-number').click(function (event) {

    event.preventDefault();

    fieldName = $(this).attr('data-field');
    type = $(this).attr('data-type');
    var input = $("input[name='" + fieldName + "']");
    var currentVal = parseInt(input.val());

    if (!isNaN(currentVal)) {
      if (type == 'minus') {

        if (currentVal > input.attr('min')) {
          input.val(currentVal - 1).change();
        }
        // Aca es donde no se esta aplicando correctamente la regla al momento de cargar la pagina del carrito
        // en el primer if entiendo que esta controlando que si el valor es > 1 se quita el atributo para desactivar el botón y
        //al cargar la pagina en el articulo del pino deberia mantener el atributo ya que comienza con value = 2.
        if (parseInt(input.val()) == input.attr('min')) {
          $(this).attr('disabled', true);
        }

      } else if (type == 'plus') {

        if (currentVal < input.attr('max')) {
          input.val(currentVal + 1).change();
        }
        if (parseInt(input.val()) == input.attr('max')) {
          $(this).attr('disabled', true);
        }
      }
    } else {
      input.val(0);
    }
  });

  $('.input-number').focusin(function () {
    $(this).data('oldValue', $(this).val());
  });

  $('.input-number').change(function () {

    minValue = parseInt($(this).attr('min'));
    maxValue = parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());

    let name = $(this).attr('name');

    if (valueCurrent >= minValue) {
      $(".btn-number[data-type='minus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
      $(this).val($(this).data('oldValue'));
    }
    if (valueCurrent <= maxValue) {
      $(".btn-number[data-type='plus'][data-field='" + name + "']").removeAttr('disabled')
    } else {
      $(this).val($(this).data('oldValue'));
    }
  });
}

//Funcion para calcular el total del carrito
function calcTotal() {

  let totalCarrito = 0;
  let subtotalsArray = document.getElementsByClassName("subtotal");

  for (let i = 0; i < subtotalsArray.length; i++) {

    totalCarrito += parseInt(subtotalsArray[i].innerHTML);
    
    document.getElementById("subtotalCarrito").innerHTML = totalCarrito;
    document.getElementById("totalCarrito").innerHTML = totalCarrito;
  }
}

//Funcion para recalcular el subtotal en tiempo real al modificar cantidades
function calcSubTotal(unitCost, index) {
  
  let count = parseInt(document.getElementById(`count${index}`).value);
  let currencyConv = document.getElementById(`artCurrency${index}`);

  //Control para hacer la conversion de moneda de UYU a USD
  if (currencyConv.innerText === "UYU") {
    subtotal = (unitCost * count) / conversionValueUSD;
  } else {
    subtotal = unitCost * count;
  }

  document.getElementById(`artSubtotal${index}`).innerHTML = subtotal;
  document.getElementById(`artSummarySubTotal${index}`).innerHTML = subtotal;

  calcTotal();
}

//Funcion para mostrar el listado de productos del carrito
function showCartProducts(array) {

    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {

        let article = array[i];
        let currencyConv = article.currency;
        let artSubTotal = 0;

        //Control para hacer la conversion de moneda de UYU a USD
        if (currencyConv === "UYU") {
          artSubTotal = (article.unitCost * article.count) / conversionValueUSD;
        } else {
          artSubTotal = article.unitCost * article.count;
        }

        htmlContentToAppend += `
        <!-- Cart item -->
        <div class="row">
          <div class="col-12 col-md-4">
            <div class="d-block h-100">
              <img class="img-fluid img-thumbnail mb-3"
                src="${article.src}" alt="articleImg">
            </div>
          </div>
          <div class="col-12 col-md-8">
            <div>
              <div class="">
                <div class="row d-flex justify-content-between">
                  <div class="col-6 col-md-8 pt-2">
                    <h5>${article.name}</h5>
                  </div>
                  <div class="col-6 col-md-4">
                    <!-- Item unit controls -->
                    <div class="def-number-input number-input mb-0 w-100">
                      <div class="input-group">
                        <span class="input-group-prepend">
                          <button type="button" class="btn btn-outline-info btn-number" disabled="disabled" data-type="minus"
                            data-field="control${i}">
                            <span class="fa fa-minus"></span>
                          </button>
                        </span>
                        <input type="number" id="count${i}" name="control${i}" class="form-control input-number text-center"
                          onchange="calcSubTotal(${article.unitCost}, ${i});" value="${article.count}" min="1" max="5">
                        <span class="input-group-append">
                          <button type="button" class="btn btn-outline-info btn-number" data-type="plus" data-field="control${i}">
                            <span class="fa fa-plus"></span>
                          </button>
                        </span>
                      </div>
                    </div>
                    <!-- End item unit controls -->
                  </div>
                </div>
                <div class="row d-flex justify-content-between align-items-center">
                  <div class="col-12 col-md-6">
                    <p class="text-muted my-1">
                      <span class="mr-1 small">Costo:</span>
                      <span class="font-weight-bold small" id="artCurrency${i}">${article.currency}</span>
                      <span class="font-weight-bold small">${article.unitCost}</span>
                    </p>
                  </div>
                </div>
                <div class="row d-flex justify-content-between align-items-center">
                  <div class="col-5 col-lg-6 mt-4">
                    <a type="button" class="text-danger small text-uppercase">
                      <i class="fas fa-trash-alt mr-1"></i>Borrar
                    </a>
                  </div>
                  <div class="col-7 col-lg-6 mt-4 text-right">
                    <span class="small text-muted pr-1">Costo Total:</span>
                    <span class="small font-weight-bold px-0">USD</span>
                    <span class="subtotal font-weight-bold" id="artSubtotal${i}">${artSubTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- End cart item -->
        
        <hr class="mb-4">
        
        `
        document.getElementById("cart-items").innerHTML = htmlContentToAppend;

        //Aca es donde entiendo que debera de poder calcularse el subtotal con el control de divisa 
        //modificando el valor anterior al momento de cargar la pagina
        //pero se me genera un error que no me doy cuenta cual es
        
        ////* calcSubTotal(article.unitCost, i); *///
    }
}

//Funcion para mostrar los articulos en el resumen de pedido
function showSummaryProducts(array) {
  
  let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {

        let article = array[i];
        let currencyConv = article.currency;
        let artSubTotal = 0;

        //Control para hacer la conversion de moneda de UYU a USD
        if (currencyConv === "UYU") {
          artSubTotal = (article.unitCost * article.count) / conversionValueUSD;
        } else {
          artSubTotal = article.unitCost * article.count;
        }

        htmlContentToAppend += `
        <li class="list-group-item font-weight-lighter d-flex justify-content-between align-items-center border-0 px-0 py-1">
          <div>${article.name}</div>
          <div class="d-flex align-items-center">
            <div class="small mr-1">USD</div>
            <div id="artSummarySubTotal${i}">${artSubTotal}</div>
          </div>
        </li>
        `
        document.getElementById("summaryItems").innerHTML = htmlContentToAppend;
    }
}

// Funcion para contar la cantidad de articulos agregados al carrito
function showProductsCount(array) {
  document.getElementById("productCount").innerText = array.length;
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  
  // Traer el listado de productos desde el json a traves de la url
  getJSONData(CART_INFO_URL_ARRAY).then(function (resultObj) {

    if (resultObj.status === "ok") {

      cartPoruducts = resultObj.data.articles;

      // Muestro el conteo de productos agregados al carrito
      showProductsCount(cartPoruducts);

      // Muestro la info de los productos agregados al carrito
      showCartProducts(cartPoruducts);

      //Muestro los controles de cantidad
      itemCountControls();

      // Muestro los productos del carrito en el resumen de pedido
      showSummaryProducts(cartPoruducts);

      //Muestro los valores totales del carrito
      calcTotal();
    }
  });

  // Inicializador de tooltips
  $(this).ready(function() {
      $("[data-toggle=tooltip]").tooltip();
  });

  // Inicializador de popovers
  $(this).ready(function(){
      $('[data-toggle="popover"]').popover();
  });    
});

