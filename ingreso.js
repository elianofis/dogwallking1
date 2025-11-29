// ingreso.js

document.getElementById("formIngreso").addEventListener("submit", function(e){
    e.preventDefault();

    // Obtener los valores del formulario
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    // Validación básica
    if(email === "" || password === ""){
        alert("Por favor completa todos los campos.");
        return;
    }

    // Aquí podrías validar credenciales reales si tuvieras backend
    // Por ahora simplemente redirige después de un ingreso exitoso

    // Redirección al blog
    window.location.href = "blog_dog_wallking.html";

    // Si quieres que ingrese a adopta.html, usa esta línea:
    // window.location.href = "adopta.html";
});
