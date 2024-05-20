document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const listaProductos = document.getElementById('listaProductos');
    const listaProductosEnLinea = document.getElementById('productosEnLinea');
    const listaPrecios = document.getElementById('precios');

    if (productForm) {
        productForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nombre = document.getElementById('nombreProducto').value;
            const precio = document.getElementById('precioProducto').value;
            const descripcion = document.getElementById('descripcionProducto').value;
            const foto = document.getElementById('fotoProducto').files[0]; 

            const productItem = document.createElement('div');
            productItem.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: $${precio}</p>
                <p>${descripcion}</p>
                <img src="${foto ? URL.createObjectURL(foto) : ''}" alt="${nombre}">
                <button onclick="eliminarProducto(this)">Eliminar</button>
            `;
            listaProductos.appendChild(productItem);

            const productItemEnLinea = document.createElement('div');
            productItemEnLinea.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: $${precio}</p>
                <p>${descripcion}</p>
                <img src="${foto ? URL.createObjectURL(foto) : ''}" alt="${nombre}">
            `;
            listaProductosEnLinea.appendChild(productItemEnLinea);

            // Agregamos el producto a la lista de precios solo si la sección de precios está activa
            if (listaPrecios.classList.contains('active')) {
                const precioItem = document.createElement('div');
                precioItem.innerHTML = `
                    <h3>${nombre}</h3>
                    <p>Precio: $${precio}</p>
                `;
                listaPrecios.appendChild(precioItem);
            }

            productForm.reset();
        });
    }

    window.eliminarProducto = function(button) {
        button.parentElement.remove();
        // Aquí se debería eliminar el producto del servidor
    };

    window.mostrarSeccion = function(seccion) {
        document.querySelectorAll('.seccion').forEach(function(section) {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        document.getElementById(seccion).classList.add('active');
        document.getElementById(seccion).style.display = 'block';
    };
});
