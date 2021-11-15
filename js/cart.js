//Variable para almancenar el arreglo obtenido al llamar al endpoint
var cartProducts = [];

//Valor de la cotización del USD
var conversionValueUSD = 40;

//Valor del costo de envio elegido.
var shippingCost;

//Obtengo el nuevo articulo agregado al carrito.
var newCartItems = localStorage.getItem("newCartArts");

//Configuración de botones de swal2 para mostrar btns de BS.
var swalBSCancelAcceptButtons = Swal.mixin({
  customClass: {
      confirmButton: 'btn btn-danger m-3',
      cancelButton: 'btn btn-secondary m-3'
  },
  buttonsStyling: false
});

var swalBSStandardBtn = Swal.mixin({
  customClass: {
      confirmButton: 'btn btn-info m-3',
  },
  buttonsStyling: false
});

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
  let shipTypes = document.getElementsByName('shippingType'); 
  
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
function showCartProducts() {


  if (cartProducts.length > 0) {
    let htmlContent = "";

    for (let i = 0; i < cartProducts.length; i++) {

      let article = cartProducts[i];
      let currencyConv = article.currency;
      let artSubTotal = 0;

      //Control para hacer la conversion de moneda de UYU a USD
      if (currencyConv === "UYU") {
        artSubTotal = (article.unitCost * article.count) / conversionValueUSD;
      } else {
        artSubTotal = article.unitCost * article.count;
      }

      htmlContent += `
    <div id="art${i}">
      <!-- Cart item -->
      <div class="row">
        <div class="col-12 col-md-4">
          <div class="d-block">
            <img class="img-fluid img-thumbnail"
              src="${article.src}" alt="articleImg">
          </div>
        </div>
        <div class="col-12 col-md-8">
          <div>
            <div>
              <div class="row d-flex justify-content-between">
                <div class="col-6 col-md-8 pt-2">
                  <h5>${article.name}</h5>
                </div>
                <div class="col-6 col-md-4">
                  <!-- Item unit controls -->
                  <div class="def-number-input number-input mb-0 w-100 pt-2">
                    <div class="input-group">
                      <span class="input-group-prepend">
                        <button type="button" class="btn btn-outline-info btn-number" data-type="minus"
                          data-id="count${i}">
                          <span class="fa fa-minus"></span>
                        </button>
                      </span>
                      <input id="count${i}" name="control${i}" data-name="${article.name}" class="form-control input-number text-center"
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
                  <a type="button" class="text-danger small text-uppercase" onclick="deleteArticle('${article.name}')">
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

      <!-- Line brake -->
      <hr class="m-4">
    </div>
    `
    }

  //Control para que los controles de cantidad se muestren en el estilo correcto desde el comienzo
  // y se haga el calculo de subtotal y total una sola vez
  $("#cart-items").html(htmlContent).ready(function () {
    for (let i = 0; i < cartProducts.length; i++) {

      $(`#count${i}`).trigger("change", "not_subtotal");
    }
    calcSubTotal();
  });
  } else {
    console.log("test")
    document.getElementById("premiumradio").setAttribute("disabled", "disabled");
    document.getElementById("expressradio").setAttribute("disabled", "disabled");
    document.getElementById("standardradio").setAttribute("disabled", "disabled");
    document.getElementById("subtotalCarrito").innerText = "-";
    document.getElementById("totalCarrito").innerText = "-";
    document.getElementById("cart-items").innerHTML =`
    <div class="card-body mb-0">
      <div class="col-sm-12 empty-cart-cls text-center"> <img src="img/logos/bag.png" width="180" height="180" class="img-fluid mb-3">
        <h4 class="text-dark">El carrito se encuentra vacío</h4>
        <p>Agrega un nuevo artículo desde el listado de productos.</p>
        <a href="products.html" class="btn btn-info m-2">Productos</a>
      </div>
    </div>
    `
  }
  showProductsCount();
  // Muestro los productos del carrito en el resumen de pedido
  showSummaryProducts();
}

//Funcion para mostrar los articulos en el resumen de pedido
function showSummaryProducts() {

  let htmlContent = "";

  for (let i = 0; i < cartProducts.length; i++) {

    let article = cartProducts[i];
    let currencyConv = article.currency;
    let artSubTotal = 0;

    //Control para hacer la conversion de moneda de UYU a USD
    if (currencyConv === "UYU") {
      artSubTotal = (article.unitCost * article.count) / conversionValueUSD;
    } else {
      artSubTotal = article.unitCost * article.count;
    }

    htmlContent += `
        <li id="artSummary${i}"class="list-group-item font-weight-lighter d-flex justify-content-between align-items-center border-0 px-0 py-1">
          <div>${article.name}</div>
          <div class="d-flex align-items-center">
            <div class="small mr-1">USD</div>
            <div id="artSummarySubTotal${i}">${artSubTotal}</div>
          </div>
        </li>
        `
  }
  document.getElementById("summaryItems").innerHTML = htmlContent;
}

//Funcion para eliminar articulo del carrito.
function deleteArticle(name) {

  //Alerta de advertencia previa al borrado.
  swalBSCancelAcceptButtons.fire({
    title: '¡Advertencia!',
    text: "¿Estas seguro que quieres borrar el artículo el carrito?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      //Alerta de confirmación del borrado.
      swalBSStandardBtn.fire(
        '¡Éxito!',
        'Artículo borrado del carrito.',
        'success'
      )
      //Ejecución del borrado.
      cartProducts = cartProducts.filter(function (product) {
        return product.name !== name;
      });
      showCartProducts(cartProducts);
    }
  });
}

//Funcion para borrar el carrito.
function deleteCartAll() {
  
  //Alerta de advertencia previa al borrado.
  swalBSCancelAcceptButtons.fire({
    title: '¡Advertencia!',
    text: "¿Estas seguro que quieres vaciar el carrito?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Vaciar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      cartProducts = [];
      showCartProducts();;
    }
  });
}

//Funcion para contar la cantidad de articulos agregados al carrito
function showProductsCount() {
  //if (cartProducts.length > 0) {
    document.getElementById("productCount").innerText = cartProducts.length;
    document.getElementById("productSummaryCount").innerText = cartProducts.length;
  //} else {
    
  //}
}

//Funcion para validar los campos del metodo de pago elegido.
function validatePaymentModal() {
 
  let paymentOptions = document.getElementsByName("paymentType");
  let payRadioErrFeed = document.getElementById("payRadioErrFeed");
  let validateForms = true;

  if (!paymentOptions[0].checked && !paymentOptions[1].checked) {
    validateForms = false;
    payRadioErrFeed.classList.add("is-invalid");
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
  let selectPaymentBtnErrFeed = document.getElementById("showModalBtn");

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
    selectPaymentBtnErrFeed.classList.add("is-invalid");

  } else {
    selectPaymentBtnErrFeed.classList.remove("is-invalid");
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

  //Funcion que trae el listado de productos en un json a traves de la url.
  getJSONData(CART_INFO_URL_ARRAY).then(function (resultObj) {

    if (resultObj.status === "ok") {

      cartProducts = resultObj.data.articles;

      //Control de existencia del elemento guardado en local.
      if (newCartItems) {

        let newCartItemsArray = JSON.parse(newCartItems).articles;

        for (let i = 0; i < newCartItemsArray.length; i++) {
          
          let newArticle = newCartItemsArray[i];
          
          newArticle =
          {
            id: newArticle.id,
            name: newArticle.name,
            count: newArticle.count,
            unitCost: newArticle.unitCost,
            currency: newArticle.currency,
            src: newArticle.src
          }
          //Agrega una instancia de articulo al array de productos.
          cartProducts.push(newArticle);
        }
      }

      // Muestro la info de los productos agregados al carrito
      showCartProducts();
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

  let findProductName = $(this).attr("data-name");

  //Funcion para actualizar cantidad de cada articulo en el cartProducts.
  cartProducts.map(function (product) {
    if (product.name == findProductName) {
      product.count = valueCurrent;
    }
    return product;
  });
  
  //Actualizar los calculos en summary.
  if (flag !== "not_subtotal") {
    calcSubTotal();
    if ($("#shippingCost").text() != "-") {

      calcShipping();
    }
    calcTotal();
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
  window.scrollTo(0, 0);
})
//Funcion de evento para restablecer seleccion del metodo de pago al cerrar
//el modal sin aceptar un metodo de pago.
.on("click", "#paymentModal [data-dismiss=modal]", function () {
  let selectPaymentBtnErrFeed = document.getElementById("showModalBtn");

  if (!validatePaymentModal()) {
    $("[name=paymentType]").each(function (i) {
      $(this).prop("checked", false);
    });
    $("#cardPaymentForm").hide();
    $("#bankPaymentForm").hide();
    selectPaymentBtnErrFeed.classList.add("is-invalid");
    selectPaymentBtnErrFeed.classList.remove("is-valid");
  }
})
//Funcion de evento para validar el metodo de pago elegido al hacer clic en aceptar.
.on("click", "#validatePaymentModal", function () {

  let payRadioErrFeed = document.getElementById("payRadioErrFeed");
  let selectPaymentBtnErrFeed = document.getElementById("showModalBtn");

  if (validatePaymentModal()) {

    let formID;
    
    if ($("#banksradio").is(":checked")) {
      formID = "#bankPaymentForm";
    } else {
      formID = "#cardPaymentForm";
    }
    
    let paymentData = $(formID).serializeArray();
    selectPaymentBtnErrFeed.classList.remove("is-invalid");
    selectPaymentBtnErrFeed.classList.add("is-valid");

    $("#paymentModal").modal('hide');
    $("#paymentInfo").val(JSON.stringify(paymentData));
  }
})
//Funcion de evento para mostrar solo el form del metodo de pago seleccionado.
.on("change", "[name=paymentType]", function (event) {
  
  let payRadioErrFeed = document.getElementById("payRadioErrFeed");
  let cardPaymentForm = $("#cardPaymentForm");
  let bankPaymentForm = $("#bankPaymentForm");
  
  if (event.target.id == 'cardsradio') {
    cardPaymentForm.show();
    bankPaymentForm.hide();
    bankPaymentForm.removeClass("was-validated");
    payRadioErrFeed.classList.remove("is-invalid");
  }
  if (event.target.id == 'banksradio') {
    cardPaymentForm.hide();
    bankPaymentForm.show();
    cardPaymentForm.removeClass("was-validated");
    payRadioErrFeed.classList.remove("is-invalid");
  }
});