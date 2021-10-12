var cartPoruducts = {};

// Controles para sumar/restar cantidad de articulos agregados al carrito
function itemCountControls() {
  
  $('.btn-number').click(function(e){

    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});

$('.input-number').focusin(function(){
   $(this).data('oldValue', $(this).val());
});

$('.input-number').change(function() {
    
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    
    let name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+ name +"']").removeAttr('disabled')
    } else {
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='"+ name +"']").removeAttr('disabled')
    } else {
        $(this).val($(this).data('oldValue'));
    }
});

$(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}

// Funcion para mostrar el listado de productos del carrito
function showCartProducts(array) {

    let htmlContentToAppend = "";

    for (let item of array) {

        let article = item;

        htmlContentToAppend += `
        <!-- Cart item -->
        <div class="row">
          <div class="col-md-5 col-lg-3">
            <div class="d-block h-100">
              <img class="img-fluid img-thumbnail mb-3"
                src="${article.src}" alt="articleImg">
            </div>
          </div>
          <div class="col-md-7 col-lg-9">
            <div>
              <div class="d-flex justify-content-between">
                <div>
                  <h5>${article.name}</h5>
                  <p class="my-3 text-muted text-uppercase small">${article.currency + " " + article.unitCost}</p>
                </div>

                <!-- Item unit controls -->
                <div>
                  <div class="def-number-input number-input safari_only mb-0 w-100">
                    <div class="input-group">
                      <span class="input-group-prepend">
                        <button type="button" class="btn btn-outline-info btn-number" disabled="disabled" data-type="minus"
                          data-field="quant[1]">
                          <span class="fa fa-minus"></span>
                        </button>
                      </span>
                      <input type="number" name="quant[1]" class="form-control input-number text-center" value="1" min="1" max="10">
                      <span class="input-group-append">
                        <button type="button" class="btn btn-outline-info btn-number" data-type="plus" data-field="quant[1]">
                          <span class="fa fa-plus"></span>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <!-- Item unit controls -->

              </div>
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <a type="button" class="text-danger small text-uppercase mr-3">
                    <i class="fas fa-trash-alt mr-1"></i>Borrar</a>
                </div>
                <p class="mb-0"><span><strong>${article.currency + " " + article.unitCost}</strong></span></p>
              </div>
            </div>
          </div>
        </div>
        <!-- Cart item -->
        
        <hr class="mb-4">
        
        `

        document.getElementById("cart-items").innerHTML = htmlContentToAppend;
    }
}

// Funcion para mostrar los articulos en el resumen de pedido
function showSummaryProducts(array) {
  
  let htmlContentToAppend = "";

    for (let item of array) {

        let article = item;

        htmlContentToAppend += `
        <li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-1">
          <small>${article.name}</small>
          <span><small>${article.currency + " " + article.unitCost}</small></span>
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

      cartPoruducts = resultObj.data

      // Muestro el conteo de productos agregados al carrito
      showProductsCount(cartPoruducts.articles);

      // Muestro la info de los productos agregados al carrito
      showCartProducts(cartPoruducts.articles);

      // Muestro los controles de cantidad
      itemCountControls();

      // Muestro los productos del carrito en el resumen de pedido
      showSummaryProducts(cartPoruducts.articles);
    }
  });

  // Inicializador de tooltips
  $(document).ready(function() {
      $("[data-toggle=tooltip]").tooltip();
  });

  // Inicializador de popovers
  $(document).ready(function(){
      $('[data-toggle="popover"]').popover();
  });    
});

