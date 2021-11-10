//Variable para almancenar el arreglo obtenido al llamar al endpoint
var cartPoruducts = [];

//Valor de la cotización del USD
var conversionValueUSD = 40;

//Valor del costo de envio elegido.
var shippingCost;

//Funcion para calcular el total del carrito
function calcTotal() {

  let totalCarrito = 0;

  totalCarrito = parseInt($("#subtotalCarrito").text());

  //Costo de envio se agrega AQUI para sumar al total del carrito
  if (shippingCost != null) {
    $("#totalCarrito").html(shippingCost + totalCarrito);
  } else {
    $("#totalCarrito").html(totalCarrito); 
  }
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

      subTotals = Math.round((unitCost * count) / conversionValueUSD);

    } else {

      subTotals = Math.round(unitCost * count);
    }

    $(`#artSubtotal${countIndex}`).html(subTotals);
    $(`#artSummarySubTotal${countIndex}`).html(subTotals);
    totalCarrito += subTotals;
  }

  $("#subtotalCarrito").html(totalCarrito);
  calcTotal();
}

//Funcion para calcular el envío.
function calcShipping() {

  let subtotal = parseInt(document.getElementById('subtotalCarrito').innerText);
  let shipTypes = document.getElementsByName('shippingType')
  
  if (shipTypes[0].checked) {

    shippingCost = Math.round(shipTypes[0].value * subtotal);
  }

  if (shipTypes[1].checked) {

    shippingCost = Math.round(shipTypes[1].value * subtotal);
  }

  if (shipTypes[2].checked) {
  
    shippingCost = Math.round(shipTypes[2].value * subtotal);
  }

  document.getElementById('shippingCost').innerText = shippingCost;
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
  $("#cart-items").html(htmlContent).ready(function () {
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

//Funcion para contar la cantidad de articulos agregados al carrito
function showProductsCount(array) {
  document.getElementById("productCount").innerText = array.length;
  document.getElementById("productSummaryCount").innerText = array.length;
}

//Funcion para validar los campos del metodo de pago elegido.
function validatePaymentModal() {
 
  let paymentOptions = document.getElementsByName("paymentType");
  let validateForms = true;

  if (!paymentOptions[0].checked && !paymentOptions[1].checked) {
    validateForms = false;
  }

  if (paymentOptions[0].checked) {
    let form = document.getElementById("bankPaymentForm");
    if (form.checkValidity() === false) {
      validateForms = false;
    }
    form.classList.add('was-validated');
  }

  if (paymentOptions[1].checked) {
    let form = document.getElementById("cardPaymentForm");
    if (form.checkValidity() === false) {
      validateForms = false;
    }
    form.classList.add('was-validated');
  }

  return validateForms;
}
//Funcion para validar todos los campos del carrito antes de generar la orden.
function validateForms() {

  let cartValid = true;
  let shippingTypeForm = document.getElementById("shippingTypeForm");
  let addressForm = document.getElementById("addressForm");
  let selectPaymentBtn = document.getElementById("showModalBtn");

  //Validar seleccion de tipo de envio.
  if (shippingTypeForm.checkValidity() === false) {

    cartValid = false;

    document.getElementById("collapseShippingHead").classList.add("collapsed");
    document.getElementById("collapseShippingCard").classList.add("show");
  }
  shippingTypeForm.classList.add('was-validated');

  //Validar formulario de direccion.
  if (addressForm.checkValidity() === false) {

    cartValid = false;

    document.getElementById("collapseAddressHead").classList.add("collapsed");
    document.getElementById("collapseAddressCard").classList.add("show");
  }
  addressForm.classList.add('was-validated');

  //Validar seleccion de metodo de pago.
  if (!validatePaymentModal()) {

    cartValid = false;

    document.getElementById("collapsePaymentHead").classList.add("collapsed");
    document.getElementById("collapsePaymentCard").classList.add("show");
    selectPaymentBtn.classList.add("is-invalid");

  } else {
    selectPaymentBtn.classList.remove("is-invalid");
  }

  if (!cartValid) {
    setTimeout(function () {
      $('<div class="dangerAlert alert alert-danger">' +
        '<i class="fa fa-times-circle text-danger mx-2"></i>' +
        '<strong>Error.</strong> Corrija los campos señalados.' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '&times;</button></div>').hide().appendTo('#alertInfo').fadeIn(300);

      $(".alert").delay(3000).fadeOut(
        "normal",
        function () {
          $(this).remove().fadeIn(300);
        }
      );
    }, 300);
  }
  return cartValid;
}

//Función que se ejecuta una vez que el evento de carga de todos los elementos
// html del documento ha finalizado.
$(document).ready(function () {
  //Funcion que trae el listado de productos desde el json a traves de la url
  getJSONData(CART_INFO_URL_ARRAY).then(function (resultObj) {

    if (resultObj.status === "ok") {

      cartPoruducts = resultObj.data.articles;

      // Muestro la info de los productos agregados al carrito
      showCartProducts(cartPoruducts);

      // Muestro el conteo de productos agregados al carrito
      showProductsCount(cartPoruducts);

      // Muestro los productos del carrito en el resumen de pedido
      showSummaryProducts(cartPoruducts);
    }

    // Inicializador de popovers
    $('[data-toggle="popover"]').popover();

  }); 
})
//Funciones de evento para sumar/restar cantidad de articulos agregados al carrito
.on("click", ".btn-number", function (event) {
  
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
}).on("focusin", ".input-number", function () {
  
  $(this).data('oldValue', $(this).val());
}).on("change", ".input-number", function (event, flag) {
  
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
    $(".btn-number[data-type='plus'][data-id='" + countId + "']").prop('disabled', true);
  }
  if (flag !== "not_subtotal") {
    calcSubTotal();
  }
})
//Control de evemto para cambiar tipo y costo de envio.
.on("change", 'input[type=radio][name="shippingType"]', function () {
  calcShipping();
  calcTotal();
})
//Control de evento para validar el colocar la orden y enviar los datos
.on("click", "#submitCart", function (event) {
  
  if (!validateForms()) {
    event.preventDefault();
    event.stopPropagation();
  }
})
//Funcion de evento para restablecer seleccion del metodo de pago al cerrar
//el modal sin aceptar un metodo de pago.
.on("click", "#paymentModal [data-dismiss=modal]", function () {
  
  if (!validatePaymentModal()) {
    $("[name=paymentType]").each(function (i) {
      $(this).prop("checked", false);
    });
    $("#cardPaymentForm").hide();
    $("#bankPaymentForm").hide();
  }
})
//Funcion de evento para validar el metodo de pago elegido al hacer clic en aceptar.
.on("click", "#validatePaymentModal", function () {

  if (validatePaymentModal()) {

    let formID;
    
    if ($("#banksradio").is(":checked")) {
      formID = "#bankPaymentForm";
    } else {
      formID = "#cardPaymentForm";
    }
    
    let paymentData = $(formID).serializeArray();

    $("#paymentModal").modal('hide');
    $("#paymentInfo").val(JSON.stringify(paymentData));
  }
})
//Funcion de evento para mostrar solo el form del metodo de pago seleccionado.
.on("change", "[name=paymentType]", function (event) {
  
  let cardPaymentForm = $("#cardPaymentForm");
  let bankPaymentForm = $("#bankPaymentForm");
  
  if (event.target.id == 'cardsradio') {
    cardPaymentForm.show();
    bankPaymentForm.hide();
    bankPaymentForm.removeClass("was-validated");
  }
  if (event.target.id == 'banksradio') {
    cardPaymentForm.hide();
    bankPaymentForm.show();
    cardPaymentForm.removeClass("was-validated");
  }
});