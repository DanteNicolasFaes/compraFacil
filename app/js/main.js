document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Aquí deberías enviar los datos al servidor para verificar el inicio de sesión
            // Puedes hacer una solicitud AJAX para enviar los datos al backend

            // Simulación de respuesta del servidor
            const userType = simulateServerResponse(email, password);

            if (userType === 'cliente') {
                window.location.href = 'cliente/cliente.html';
            } else if (userType === 'comercio') {
                window.location.href = 'comercio/comercio.html';
            } else {
                alert('Correo o contraseña incorrectos');
            }
        });
    }

    function simulateServerResponse(email, password) {
        // Simulación de verificación
        if (email === 'cliente@ejemplo.com' && password === 'password') {
            return 'cliente';
        } else if (email === 'comercio@ejemplo.com' && password === 'password') {
            return 'comercio';
        } else {
            return null;
        }
    }
});
