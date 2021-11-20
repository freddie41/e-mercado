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
        from: "index.html",
        msg: "Debes iniciar sesión para acceder al e-mercado."
      }));
      window.location = "login.html";
    }
});