/*document.addEventListener('DOMContentLoaded', function() {
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
*/
document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const listaProductos = document.getElementById('listaProductos');
    const listaProductosEnLinea = document.getElementById('listaProductosEnLinea');
    const listaPrecios = document.getElementById('listaPrecios');
    const mensajeExito = document.getElementById('mensajeExito');
    let productosEnLinea = []; // Lista para almacenar los productos en línea
    let cambiosPendientes = false;

    if (productForm) {
        productForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nombre = document.getElementById('nombreProducto').value;
            const precio = document.getElementById('precioProducto').value;
            const descripcion = document.getElementById('descripcionProducto').value;
            const stock = document.getElementById('stockProducto').value;
            const foto = document.getElementById('fotoProducto').files[0]; // Obtener la imagen

            // Crear el elemento de producto solo en la lista de precios
            const precioItem = document.createElement('div');
            precioItem.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: <input type="number" value="${precio}" onchange="modificarPrecio(this, '${nombre}')"></p>
                <p>Descripción: <textarea onchange="modificarDescripcion(this, '${nombre}')">${descripcion}</textarea></p>
                <p>Stock: ${stock}</p>
                <img src="${URL.createObjectURL(foto)}"> <!-- Mostrar la imagen -->
            `;
            listaPrecios.appendChild(precioItem);

            // Agregar el producto a la lista de productos en línea
            const productItemEnLinea = document.createElement('div');
            productItemEnLinea.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: $${precio}</p>
                <p>${descripcion}</p>
                <p>Stock: ${stock}</p>
                <img src="${URL.createObjectURL(foto)}"> <!-- Mostrar la imagen -->
                <button onclick="eliminarProductoEnLinea('${nombre}')">Eliminar</button>
            `;
            listaProductosEnLinea.appendChild(productItemEnLinea);

            productosEnLinea.push({
                nombre: nombre,
                precio: precio,
                descripcion: descripcion,
                stock: stock,
                fotoURL: URL.createObjectURL(foto) // Guardar la URL de la imagen en los datos del producto
            });

            mensajeExito.innerText = "Producto agregado con éxito.";
            mensajeExito.style.display = 'block';
            setTimeout(() => {
                mensajeExito.style.display = 'none';
            }, 3000);

            productForm.reset();
        });
    }

    window.eliminarProducto = function(button) {
        const productoDiv = button.parentElement;
        const productoNombre = productoDiv.querySelector('h3').innerText;

        listaProductos.querySelectorAll('div').forEach(div => {
            if (div.querySelector('h3').innerText === productoNombre) {
                div.remove();
            }
        });

        listaPrecios.querySelectorAll('div').forEach(div => {
            if (div.querySelector('h3').innerText === productoNombre) {
                div.remove();
            }
        });

        listaProductosEnLinea.querySelectorAll('div').forEach(div => {
            if (div.querySelector('h3').innerText === productoNombre) {
                div.remove();
                // Eliminar el producto de la lista de productos en línea
                productosEnLinea = productosEnLinea.filter(producto => producto.nombre !== productoNombre);
            }
        });
    };

    window.eliminarProductoEnLinea = function(nombre) {
        // Eliminar el producto de la lista de productos en línea
        productosEnLinea = productosEnLinea.filter(producto => producto.nombre !== nombre);

        // Actualizar la visualización de la lista de productos en línea
        listaProductosEnLinea.innerHTML = '';
        productosEnLinea.forEach(producto => {
            const productItemEnLinea = document.createElement('div');
            productItemEnLinea.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>${producto.descripcion}</p>
                <p>Stock: ${producto.stock}</p>
                <img src="${producto.fotoURL}"> <!-- Mostrar la imagen -->
                <button onclick="eliminarProductoEnLinea('${producto.nombre}')">Eliminar</button>
            `;
            listaProductosEnLinea.appendChild(productItemEnLinea);
        });
    };

    window.modificarPrecio = function(input, nombre) {
        cambiosPendientes = true;
    };

    window.modificarDescripcion = function(textarea, nombre) {
        cambiosPendientes = true;
    };

    window.guardarCambios = function() {
        if (!cambiosPendientes) return;

        // Actualizar la lista de productos en línea con los cambios
        listaProductosEnLinea.innerHTML = ''; // Limpiar la lista antes de reconstruirla

        listaPrecios.querySelectorAll('div').forEach(div => {
            const nombre = div.querySelector('h3').innerText;
            const nuevoPrecio = div.querySelector('p:nth-child(2) input').value;
            const nuevaDescripcion = div.querySelector('p:nth-child(3) textarea').value;
            const nuevoStock = div.querySelector('p:nth-child(4)').innerText;

            // Crear el elemento de producto en la lista de productos en línea
            const productItemEnLinea = document.createElement('div');
            productItemEnLinea.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: $${nuevoPrecio}</p>
                <p>${nuevaDescripcion}</p>
                <p>Stock: ${nuevoStock}</p>
                <img src="${productosEnLinea.find(producto => producto.nombre === nombre).fotoURL}"> <!-- Mostrar la imagen -->
                <button onclick="eliminarProductoEnLinea('${nombre}')">Eliminar</button>
            `;
            listaProductosEnLinea.appendChild(productItemEnLinea);

            productosEnLinea.forEach(producto => {
                if (producto.nombre === nombre) {
                    producto.precio = nuevoPrecio;
                    producto.descripcion = nuevaDescripcion;
                    producto.stock = nuevoStock;
                }
            });
        });

        // Mostrar mensaje de éxito
        mensajeExito.innerText = "Los cambios se han realizado con éxito.";
        mensajeExito.style.display = 'block';
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 3000);

        // Reiniciar la bandera de cambios pendientes
        cambiosPendientes = false;
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