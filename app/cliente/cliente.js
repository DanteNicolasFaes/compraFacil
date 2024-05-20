document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const mercadoPagoButton = document.getElementById('mercadoPagoButton');

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const dni = document.getElementById('dni').value;
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const telefono = document.getElementById('telefono').value;
        const domicilio = document.getElementById('domicilio').value;

        const nuevoCliente = {
            nombre,
            apellido,
            dni,
            fechaNacimiento,
            telefono,
            domicilio
        };

        // Guardar datos del cliente temporalmente
        localStorage.setItem('nuevoCliente', JSON.stringify(nuevoCliente));

        // Aquí deberías enviar los datos del cliente al servidor para registro
        fetch('/api/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoCliente)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Registro exitoso');
                registerForm.reset();
            } else {
                alert('Error en el registro');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    mercadoPagoButton.addEventListener('click', function() {
        const clientId = 'TU_CLIENT_ID'; // Reemplaza con tu Client ID de MercadoPago
        const redirectUri = encodeURIComponent('http://localhost:3000/cliente/mercadopago_callback.html');
        const mercadoPagoAuthUrl = `https://auth.mercadopago.com.ar/authorization?client_id=${clientId}&response_type=code&platform_id=mp&redirect_uri=${redirectUri}`;

        window.location.href = mercadoPagoAuthUrl;
    });

    // Llamada al backend para obtener la lista de productos disponibles
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            // Procesar los datos y mostrar los productos en la página
            renderProducts(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function renderProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpiamos el contenido anterior

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <h2>${product.nombre}</h2>
            <p>Precio: $${product.precio}</p>
            ${product.oferta ? `<p>Descuento: ${product.oferta.descuento}%</p>` : ''}
            <p>${product.descripcion}</p>
            <button>Agregar al carrito</button>
        `;
        productList.appendChild(productCard);
    });
}

