//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

    // Inicializador de tooltips
    $(document).ready(function() {
        $("[data-toggle=tooltip]").tooltip();
    });

    // Inicializador de popovers
    $(document).ready(function(){
        $('[data-toggle="popover"]').popover({
        });
    });
});

