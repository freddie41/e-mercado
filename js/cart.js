//Variable para almancenar el array obtenido del endpoint.
var cartProducts = [];

//Valor de la cotización UYU a USD.
var conversionValueUSD = 40;

//Variable para guardar costo de envio elegido.
var shippingCost;

//Trae el nuevo articulo agregado al carrito.
var newCartProducts = localStorage.getItem("newCartArts");

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

//Funcion para calcular el total del carrito.
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

//Funcion para recalcular el subtotal.
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
  
  //Actualizan los costos y cantidades en tiempo real.
  showProductsSummary();
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

//Funcion para mostrar listado de productos del carrito.
function showCartProducts() {

  //Control para mostrar productos en el carrito si existen productos en el array de productos.
  if (cartProducts.length > 0) {
    let htmlContent = "";

    for (let i = 0; i < cartProducts.length; i++) {

      let article = cartProducts[i];
      let currencyConv = article.currency;
      let artSubTotal = 0;

      //Control para hacer la conversion de moneda de UYU a USD.
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
                  <a type="button" class="text-danger small text-uppercase" onclick="deleteProduct('${article.name}')">
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

  //Evento de escucha de tipo cambio para que los controles de cantidad se muestren estilo correcto al cargar el carrito.
  $("#cart-items").html(htmlContent).ready(function () {
    for (let i = 0; i < cartProducts.length; i++) {

      //Controla que se calcule el subtotal una sola vez.
      $(`#count${i}`).trigger("change", "not_subtotal");
    }
    //Recalcula el subtotal inicial.
    calcSubTotal();
  });

  //Estado de carrito vacio.
  } else {

    //Inhabilita seleccion de opciones de tipo de envio.
    document.getElementById("premiumradio").setAttribute("disabled", "disabled");
    document.getElementById("expressradio").setAttribute("disabled", "disabled");
    document.getElementById("standardradio").setAttribute("disabled", "disabled");

    //Muestra guiones en valores sin datos.
    document.getElementById("subtotalCarrito").innerText = "-";
    document.getElementById("totalCarrito").innerText = "-";

    //Se muestra mensaje informativo para el carrito vacio.
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
  //Muestra cantidad de productos en el resumen de pedido y carrito.
  showProductsCount();

  //Muestra productos del carrito en el resumen de pedido.
  showProductsSummary();
}

//Funcion para mostrar productos en resumen de pedido.
function showProductsSummary() {

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
        <li id="artSummary${i}"class="list-group-item font-weight-normal d-flex justify-content-between align-items-center border-0 px-0 py-1">
          <div class="d-flex align-items-center">
            <span class="mr-2">${article.count}</span>
            <span class="mr-2 small">x</span>
            ${article.name}
          </div>
          <div class="d-flex align-items-center">
            <div class="small mr-1">USD</div>
            <div id="artSummarySubTotal${i}">${artSubTotal}</div>
          </div>
        </li>
        `
  }
  document.getElementById("summaryItems").innerHTML = htmlContent;
}

//Funcion para eliminar producto del carrito.
function deleteProduct(name) {

  //Alerta de advertencia de tipo modal SweetAlert2 previa al borrado de un producto.
  swalBSDeleteAcceptButtons.fire({
    title: '¡Advertencia!',
    text: "¿Estas seguro que quieres borrar el artículo el carrito?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Borrar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
    
  }).then((result) => {

    if (result.isConfirmed) {
      
      //Alerta de confirmación del borrado de tipo modal.
      swalBSStandardBtn.fire({
        title: '¡Éxito!',
        text: 'Artículo borrado del carrito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      })
      //Ejecución del borrado.
      cartProducts = cartProducts.filter(function (product) {
        return product.name !== name;
      });
      //Muestra el listado de productos actualizado.
      showCartProducts(cartProducts);
    }
  });
}

//Funcion para borrar carrito.
function deleteCartAll() {
  
  //Alerta de advertencia de tipo modal SweetAlert2 previa al borrado del carrito.
  swalBSDeleteAcceptButtons.fire({
    title: '¡Advertencia!',
    text: "¿Estas seguro que quieres vaciar el carrito?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Vaciar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {

    //Borrado del carrito
    if (result.isConfirmed) {
      cartProducts = [];
      showCartProducts();;
    }
  });
}

//Funcion para mostrar cantidad de productos en resumen de pedido y carrito.
function showProductsCount() {
    document.getElementById("productCount").innerText = cartProducts.length;
    document.getElementById("productSummaryCount").innerText = cartProducts.length;
}

//Funcion para validar los campos del metodo de pago elegido.
function validatePaymentModal() {
 
  let paymentOptions = document.getElementsByName("paymentType");
  let payRadioErrFeed = document.getElementById("payRadioErrFeed");
  let validateForms = true;

  //Control para validar cuando no se selecciona ningun metodo de pago.
  if (!paymentOptions[0].checked && !paymentOptions[1].checked) {
    validateForms = false;
    payRadioErrFeed.classList.add("is-invalid");
  }
  //Control para validar fomulario de transferencia bancaria.
  if (paymentOptions[0].checked) {
    let form = document.getElementById("bankPaymentForm");
    if (form.checkValidity() === false) {
      validateForms = false;
    }
    form.classList.add('was-validated');
  }
  //Control para validar fomulario de pago con tarjeta.
  if (paymentOptions[1].checked) {
    let form = document.getElementById("cardPaymentForm");
    if (form.checkValidity() === false) {
      validateForms = false;
    }
    form.classList.add('was-validated');
  }

  return validateForms;
}
//Funcion para validar fomularios del carrito.
function validateForms() {

  let cartValid = true;
  let shippingTypeForm = document.getElementById("shippingTypeForm");
  let addressForm = document.getElementById("addressForm");
  let selectPaymentBtnErrFeed = document.getElementById("showModalBtn");

  //Valida seleccion de tipo de envio.
  if (shippingTypeForm.checkValidity() === false) {

    cartValid = false;

    document.getElementById("collapseShippingHead").classList.add("collapsed");
    document.getElementById("collapseShippingCard").classList.add("show");
  }
  shippingTypeForm.classList.add('was-validated');

  //Valida formulario de direccion.
  if (addressForm.checkValidity() === false) {

    //Bandera de validacion.
    cartValid = false;

    document.getElementById("collapseAddressHead").classList.add("collapsed");
    document.getElementById("collapseAddressCard").classList.add("show");
  }
  addressForm.classList.add('was-validated');

  //Valida modal de metodo de pago.
  if (!validatePaymentModal()) {

    //Bandera de validacion.
    cartValid = false;

    document.getElementById("collapsePaymentHead").classList.add("collapsed");
    document.getElementById("collapsePaymentCard").classList.add("show");
    selectPaymentBtnErrFeed.classList.add("is-invalid");

  } else {
    selectPaymentBtnErrFeed.classList.remove("is-invalid");
  }

  //Control para mostrar alerta en caso de no validar todos los campos.
  if (!cartValid) {

    //Alerta de error de tipo modal SweetAlert2 al no poder validar el carrito.
    swalBSStandardBtn.fire({
      title: '¡Ups!',
      html: 'Datos de ingreso inválidos.<br>Corrija los campos señalados.',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
    });
  }
  return cartValid;
}

//Funcion para agregar nuevos articulos al carrito.
function addNewProdToCart() {
  
  //Control de articulos agregados al carrito.
  if (newCartProducts) {

    let newCartProductsArray = JSON.parse(newCartProducts).articles;

    for (let i = 0; i < newCartProductsArray.length; i++) {

      let newProduct = newCartProductsArray[i];

      //Busca si el producto agregado al carrito ya existe en el carrito.
      let foundProd = cartProducts.find(product => product.id === newProduct.id);

      if (foundProd) {

        for (let x = 0; x < cartProducts.length; x++) {
          
          let product = cartProducts[x];

          //Control para sumar una unidad del mismo producto agregado al carrito.
          if (product === foundProd) {

            product = product.count++;
          }
        }

      } else {

        //Crea un nuevo objeto para agregar al array de productos.
        newProduct =
        {
          id: newProduct.id,
          name: newProduct.name,
          count: newProduct.count,
          unitCost: newProduct.unitCost,
          currency: newProduct.currency,
          src: newProduct.src
        }
        //Agrega el articulo al array de productos.
        cartProducts.push(newProduct);
      }
    }
  }
}

//Función que se ejecuta una vez que el evento de carga de todos los elementos
// html del documento ha finalizado.
$(document).ready(function () {

  //Trae el usuario logueado.
  let userLogged = localStorage.getItem("userLogged");
  let googleUserLogged = localStorage.getItem("googleUserProfile");

  //Control para validar que el usuario haya hecho login.
  if (!userLogged && !googleUserLogged) {
    localStorage.setItem("login-need", JSON.stringify({
      from: "cart.html",
      msg: "Debes iniciar sesión para acceder al carrito."
    }));
    window.location = "login.html";
  }

  //Funcion que trae listado de productos desde el endpoint.
  getJSONData(CART_INFO_URL).then(function (resultObj) {

    if (resultObj.status === "ok") {

      cartProducts = resultObj.data.articles;

      //Verifica si hay articulos nuevos para agregar al carrito.
      addNewProdToCart();

      //Muestra productos actualizados en carrito.
      showCartProducts();
    }

    //Inicializador de popovers.
    $('[data-toggle="popover"]').popover();

  }); 
})
//Bindeo de evento para sumar/restar cantidad de articulos agregados al carrito.
.on("click", ".btn-number", function (event) {
  
  event.preventDefault();

  fieldId = $(this).attr('data-id');
  type = $(this).attr('data-type');
  var input = $(`#${fieldId}`);
  var currentVal = parseInt(input.val());

  if (currentVal) {

    //Control al cliquear en btn sustraer.
    if (type == 'minus') {

      //Control para sustraccion de un valor de cantidad.
      if (currentVal > input.attr('min')) {

        input.val(currentVal - 1).change();
      }

    //Control al cliquear en btn adicionar.
  } else if (type == 'plus') {

      //Control para adicion de un valor de cantidad.
      if (currentVal < input.attr('max')) {

        input.val(currentVal + 1).change();
      }
    }
  } else {
    input.val(0);
  }
})
//Bindeo de evento al hacer focusin en el valor seleccionado.
.on("focusin", ".input-number", function () {
  $(this).data('oldValue', $(this).val());
})
//Bindeo de evento al cliquear en los btn sustraer y adicionar.
.on("change", ".input-number", function (event, flag) {
  
  minValue = parseInt($(this).attr('min'));
  maxValue = parseInt($(this).attr('max'));
  valueCurrent = parseInt($(this).val());

  let countId = $(this).attr('id');

  //Control para cambiar estilo de btn al tener un valor menor a 1.
  if (valueCurrent > minValue) {
    $(".btn-number[data-type='minus'][data-id='" + countId + "']").prop('disabled', false);
  } else {
    $(".btn-number[data-type='minus'][data-id='" + countId + "']").prop('disabled', true);
  }
  //Control para cambiar estilo de btn al tener un valor menor al valor maximo configurado.
  if (valueCurrent < maxValue) {
    $(".btn-number[data-type='plus'][data-id='" + countId + "']").prop('disabled', false);
  } else {
    $(".btn-number[data-type='plus'][data-id='" + countId + "']").prop('disabled', true);
  }

  let findProductName = $(this).attr("data-name");

  //Funcion para actualizar cantidad de cada articulo en array de productos.
  cartProducts.map(function (product) {
    if (product.name == findProductName) {
      product.count = valueCurrent;
    }
    return product;
  });
  
  //Control que actualiza costos de subtotal, envio y total en resumen de pedido.
  if (flag !== "not_subtotal") {
    calcSubTotal();
    if ($("#shippingCost").text() != "-") {
      calcShipping();
    }
    calcTotal();
  }
})
//Bindeo de evento al cambiar tipo de envio que recalcula costo de envio y total.
.on("change", 'input[type=radio][name="shippingType"]', function () {
  calcShipping();
  calcTotal();
})
//Bindeo de evento de click que valida crear orden.
.on("click", "#submitCart", function (event) {
  
  if (!validateForms()) {

    event.preventDefault();
    event.stopPropagation();

  } else {

    //Alerta de confirmación de tipo modal al crear la orden con exito.
    swalBSStandardBtn.fire({
      title: '¡Éxito!',
      html: 'Tu orden ha sido creada.<br>En breves recibirás un email con los datos de la orden.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
    });
  }
})
//Bindeo de evento que restablece metodo de pago elegido al hacer clic en btn cerrar.
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
//Bindeo de evento que valida metodo de pago elegido al hacer clic en aceptar.
.on("click", "#validatePaymentModal", function () {

  let selectPaymentBtnErrFeed = document.getElementById("showModalBtn");

  if (validatePaymentModal()) {

    //Variable que guarda info de pago elegida.
    let formID;
    
    //Control para guardar info de pago en atributo paymentData.
    if ($("#banksradio").is(":checked")) {
      formID = "#bankPaymentForm";
    } else {
      formID = "#cardPaymentForm";
    }
    
    let paymentData = $(formID).serializeArray();
  
    $("#paymentModal").modal('hide');
    $("#paymentInfo").val(JSON.stringify(paymentData));

    selectPaymentBtnErrFeed.classList.remove("is-invalid");
    selectPaymentBtnErrFeed.classList.add("is-valid");
  }
})
//Bindeo de evento para mostrar el form del metodo de pago seleccionado.
.on("change", "[name=paymentType]", function (event) {
  
  let payRadioErrFeed = document.getElementById("payRadioErrFeed");
  let cardPaymentForm = $("#cardPaymentForm");
  let bankPaymentForm = $("#bankPaymentForm");
  
  //Control para mostrar formulario de tarjeta al seleccionar metodo tarjeta.
  if (event.target.id == 'cardsradio') {
    cardPaymentForm.show();
    bankPaymentForm.hide();
    bankPaymentForm.removeClass("was-validated");
    payRadioErrFeed.classList.remove("is-invalid");
  }
  //Control para mostrar formulario de banco al seleccionar metodo Z.
  if (event.target.id == 'banksradio') {
    cardPaymentForm.hide();
    bankPaymentForm.show();
    cardPaymentForm.removeClass("was-validated");
    payRadioErrFeed.classList.remove("is-invalid");
  }
});