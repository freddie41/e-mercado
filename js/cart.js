//Variable para almancenar el arreglo obtenido al llamar al endpoint
var cartPoruducts = [];

//Valor de la cotización del USD
var conversionValueUSD = 40;

//Controles para sumar/restar cantidad de articulos agregados al carrito
function itemCountControls() {
  
  $('.btn-number').click(function (event) {

    event.preventDefault();

    fieldId = $(this).attr('data-id');
    type = $(this).attr('data-type');
    var input = $(`#${fieldId}`);
    var currentVal = parseInt(input.val());

    if (currentVal) {
      if (type == 'minus') {

        if (currentVal > input.attr('min')) {
          input.val(currentVal - 1).change();
        }

      } else if (type == 'plus') {

        if (currentVal < input.attr('max')) {
          input.val(currentVal + 1).change();
        }
      }
    } else {
      input.val(0);
    }
  });

  $('.input-number').focusin(function () {
    $(this).data('oldValue', $(this).val());
  });

  $('.input-number').change(function (event, flag) {

    minValue = parseInt($(this).attr('min'));
    maxValue = parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());

    let countId = $(this).attr('id');

    if (valueCurrent > minValue) {
      $(".btn-number[data-type='minus'][data-id='" + countId + "']").prop('disabled', false);
    } else {
      $(".btn-number[data-type='minus'][data-id='" + countId + "']").prop('disabled', true);
    }
    if (valueCurrent < maxValue) {
      $(".btn-number[data-type='plus'][data-id='" + countId + "']").prop('disabled', false);
    } else {
      $(".btn-number[data-type='plus'][data-id='" + countId + "']").attr('disabled', true);
    }

    if (flag !== "not_subtotal") {
      calcSubTotal();  
    }

  });
}

//Funcion para calcular el total del carrito
function calcTotal() {

  let totalCarrito = 0;

  totalCarrito = $("#subtotalCarrito").text();
  
  //Costo de envio se agrega AQUI para sumar al total del carrito

  $("#totalCarrito").html(totalCarrito);
}

//Funcion para recalcular el subtotal en tiempo real al modificar cantidades
function calcSubTotal() {

  let counts = $("[data-count]");

  let subTotals = 0;

  let totalCarrito = 0;

  for (let i = 0; i < counts.length; i++) {

    let $item = $(counts[i]);
    let countIndex = $item.attr('data-count');
    let currencyConv = $item.attr('data-currency');
    let count = $item.val();
    let unitCost = $item.attr('data-unitcost');

    //Control para hacer la conversion de moneda de UYU a USD
    if (currencyConv === "UYU") {
      subTotals = (unitCost * count) / conversionValueUSD;
    } else {
      subTotals = unitCost * count;
    }

    $(`#artSubtotal${countIndex}`).html(subTotals);
    $(`#artSummarySubTotal${countIndex}`).html(subTotals);

    totalCarrito += subTotals;
  }
  $("#subtotalCarrito").html(totalCarrito);

  calcTotal();
}

//Funcion para mostrar el listado de productos del carrito
function showCartProducts(array) {

    let htmlContent = "";

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

        htmlContent += `
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
                          <button type="button" class="btn btn-outline-info btn-number" data-type="minus"
                            data-id="count${i}">
                            <span class="fa fa-minus"></span>
                          </button>
                        </span>
                        <input id="count${i}" name="control${i}" class="form-control input-number text-center"
                        value="${article.count}" min="1" max="5" data-count="${i}" data-currency="${article.currency}" data-unitcost="${article.unitCost}">
                        <span class="input-group-append">
                          <button type="button" class="btn btn-outline-info btn-number" data-type="plus" data-id="count${i}">
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
                      <span class="font-weight-bold small">${article.currency}</span>
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
    }

    //Control para que los controles de cantidad se muestren en el estilo correcto desde el comienzo
    // y se haga el calculo de subtotal y total una sola vez
    $("#cart-items").html(htmlContent).ready(function(){
      for (let i = 0; i < array.length; i++) {

        $(`#count${i}`).trigger("change", "not_subtotal");
      }
      calcSubTotal();
    });
}

//Funcion para mostrar los articulos en el resumen de pedido
function showSummaryProducts(array) {
  
  let htmlContent = "";

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

        htmlContent += `
        <li class="list-group-item font-weight-lighter d-flex justify-content-between align-items-center border-0 px-0 py-1">
          <div>${article.name}</div>
          <div class="d-flex align-items-center">
            <div class="small mr-1">USD</div>
            <div id="artSummarySubTotal${i}">${artSubTotal}</div>
          </div>
        </li>
        `
        document.getElementById("summaryItems").innerHTML = htmlContent;
    }
}

// Funcion para contar la cantidad de articulos agregados al carrito
function showProductsCount(array) {
  document.getElementById("productCount").innerText = array.length;
  document.getElementById("productSummaryCount").innerText = array.length;
}

//Funcion para mostrar el formulario de pago segun se elija la opcion de banco o tarjeta
function showPaymentForms() {

  let radios = document.getElementsByName("paymentType");
  let cardPaymentForm = document.getElementById("cardPaymentForm");
  let bankPaymentForm = document.getElementById("bankPaymentForm");

  cardPaymentForm.style.display = 'none';
  bankPaymentForm.style.display = 'none';

  for (let i = 0; i < radios.length; i++) {
    radios[i].onclick = function () {

      let val = this.value;

      if (val == 'cardsradio') {
        cardPaymentForm.style.display = 'block';
        bankPaymentForm.style.display = 'none';
      }
      if (val == 'banksradio') {
        cardPaymentForm.style.display = 'none';
        bankPaymentForm.style.display = 'block';
      }
    }
  }
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
  
  // Traer el listado de productos desde el json a traves de la url
  getJSONData(CART_INFO_URL_ARRAY).then(function (resultObj) {

    if (resultObj.status === "ok") {

      cartPoruducts = resultObj.data.articles;

      // Muestro la info de los productos agregados al carrito
      showCartProducts(cartPoruducts);
      
      // Muestro el conteo de productos agregados al carrito
      showProductsCount(cartPoruducts);

      // Muestro los productos del carrito en el resumen de pedido
      showSummaryProducts(cartPoruducts);

      //Muestro los controles de cantidad
      itemCountControls();

      //Muestro el formulario correspondiente al metodo de pago elegido
      showPaymentForms();
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

