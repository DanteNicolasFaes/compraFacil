// Función para mostrar una sección específica
function mostrarSeccion(seccion) {
    document.querySelectorAll('.seccion').forEach(function(section) {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    document.getElementById(seccion).classList.add('active');
    document.getElementById(seccion).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del DOM
    const productForm = document.getElementById('productForm');
    const ofertaForm = document.getElementById('ofertaForm');
    const listaPrecios = document.getElementById('listaPrecios');
    const listaProductosEnLinea = document.getElementById('listaProductosEnLinea');
    const mensajeConfirmacion = document.getElementById('mensajeConfirmacion');
    const mensajeExito = document.getElementById('mensajeExito');
    const confirmarCambiosBtn = document.getElementById('confirmarCambios');
    const cancelarCambiosBtn = document.getElementById('cancelarCambios');
    let productosEnLinea = []; // Lista para almacenar los productos en línea
    let cambiosPendientes = false;

    // Función para agregar producto a "Administrar Precios" y "Productos en Línea"
    function agregarProducto(nombre, precio, descripcion, stock, foto, esOferta = false) {
        const fotoURL = URL.createObjectURL(foto);

        // Crear elemento de producto en la lista de precios
        const precioItem = document.createElement('div');
        precioItem.innerHTML = `
            <h3>${nombre}</h3>
            <p>Precio: <input type="number" value="${precio}" class="precio-input" data-nombre="${nombre}"></p>
            <p>Descripción: <textarea class="descripcion-input" data-nombre="${nombre}">${descripcion}</textarea></p>
            <p>Stock: ${stock}</p>
            <img src="${fotoURL}"> <!-- Mostrar la imagen -->
        `;
        if (esOferta) {
            precioItem.classList.add('oferta');
        }
        listaPrecios.appendChild(precioItem);

        // Agregar producto a la lista de productos en línea
        const productItemEnLinea = document.createElement('div');
        productItemEnLinea.innerHTML = `
            <h3>${nombre}</h3>
            <p>Precio: $${precio}</p>
            <p>${descripcion}</p>
            <p>Stock: ${stock}</p>
            <img src="${fotoURL}"> <!-- Mostrar la imagen -->
            <button class="eliminarProductoBtn" data-nombre="${nombre}">Eliminar</button>
        `;
        if (esOferta) {
            productItemEnLinea.classList.add('oferta');
            productItemEnLinea.innerHTML += `<span class="badge">Oferta</span>`;
        }
        listaProductosEnLinea.appendChild(productItemEnLinea);

        // Agregar producto a la lista de productos en línea (objeto)
        productosEnLinea.push({
            nombre: nombre,
            precio: precio,
            descripcion: descripcion,
            stock: stock,
            fotoURL: fotoURL, // Guardar URL de la imagen en los datos del producto
            esOferta: esOferta
        });

        // Mostrar mensaje de éxito
        mostrarMensajeExito("Producto agregado con éxito.");
    }

    // Evento de envío del formulario de productos
    if (productForm) {
        productForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Obtener valores del formulario de productos
            const nombre = document.getElementById('nombreProducto').value;
            const precio = document.getElementById('precioProducto').value;
            const descripcion = document.getElementById('descripcionProducto').value;
            const stock = document.getElementById('stockProducto').value;
            const foto = document.getElementById('fotoProducto').files[0]; // Obtener la imagen
            agregarProducto(nombre, precio, descripcion, stock, foto);
            // Resetear formulario de productos
            productForm.reset();
        });
    }

    // Evento de envío del formulario de ofertas
    if (ofertaForm) {
        ofertaForm.addEventListener('submit', function(event) {
            event.preventDefault();
            // Obtener valores del formulario de ofertas
            const nombre = document.getElementById('nombreOferta').value;
            const precio = document.getElementById('precioOferta').value;
            const descripcion = document.getElementById('descripcionOferta').value;
            const stock = document.getElementById('stockOferta').value;
            const foto = document.getElementById('fotoOferta').files[0]; // Obtener la imagen
            agregarProducto(nombre, precio, descripcion, stock, foto, true);
            // Resetear formulario de ofertas
            ofertaForm.reset();
        });
    }

    // Función para mostrar la confirmación de cambios
    window.mostrarConfirmacion = function() {
        if (cambiosPendientes) {
            mensajeConfirmacion.style.display = 'block';
        }
    };

    // Función para guardar cambios
    function guardarCambios() {
        if (!cambiosPendientes) return;

        // Actualizar la lista de productos en línea con los cambios
        listaProductosEnLinea.innerHTML = ''; // Limpiar la lista antes de reconstruirla

        listaPrecios.querySelectorAll('div').forEach(div => {
            const nombre = div.querySelector('h3').innerText;
            const nuevoPrecio = div.querySelector('input.precio-input').value;
            const nuevaDescripcion = div.querySelector('textarea.descripcion-input').value;
            const stock = productosEnLinea.find(producto => producto.nombre === nombre).stock; // Mantener el stock original
            const esOferta = productosEnLinea.find(producto => producto.nombre === nombre).esOferta;

            // Crear el elemento de producto en la lista de productos en línea
            const productItemEnLinea = document.createElement('div');
            productItemEnLinea.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: $${nuevoPrecio}</p>
                <p>${nuevaDescripcion}</p>
                <p>Stock: ${stock}</p>
                <img src="${productosEnLinea.find(producto => producto.nombre === nombre).fotoURL}"> <!-- Mostrar la imagen -->
                <button class="eliminarProductoBtn" data-nombre="${nombre}">Eliminar</button>
            `;
            if (esOferta) {
                productItemEnLinea.classList.add('oferta');
                productItemEnLinea.innerHTML += `<span class="badge">Oferta</span>`;
            }
            listaProductosEnLinea.appendChild(productItemEnLinea);

            // Actualizar los datos del producto en la lista de productos en línea
            productosEnLinea = productosEnLinea.map(producto => {
                if (producto.nombre === nombre) {
                    return {
                        ...producto,
                        precio: nuevoPrecio,
                        descripcion: nuevaDescripcion
                    };
                }
                return producto;
            });
        });

        // Ocultar mensaje de confirmación y mostrar mensaje de éxito
        mensajeConfirmacion.style.display = 'none';
        mostrarMensajeExito("Los cambios se han realizado con éxito.");
        cambiosPendientes = false;
    }

    // Función para cancelar cambios
    function cancelarCambios() {
        mensajeConfirmacion.style.display = 'none';
    }

    // Añadir eventos de confirmación y cancelación
    confirmarCambiosBtn.addEventListener('click', guardarCambios);
    cancelarCambiosBtn.addEventListener('click', cancelarCambios);

    // Función para mostrar una sección específica
    window.mostrarSeccion = function(seccion) {
        document.querySelectorAll('.seccion').forEach(function(section) {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        document.getElementById(seccion).classList.add('active');
        document.getElementById(seccion).style.display = 'block';
    };

    // Función para mostrar mensaje de éxito
    function mostrarMensajeExito(mensaje) {
        mensajeExito.innerText = mensaje;
        mensajeExito.style.display = 'block';
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 3000);
    }

    // Detectar cambios en los inputs de precios y descripciones para mostrar la confirmación
    listaPrecios.addEventListener('input', function() {
        cambiosPendientes = true;
    });

    // Función para eliminar un producto
    function eliminarProducto(nombre) {
        // Eliminar el producto de la lista de productos en línea
        productosEnLinea = productosEnLinea.filter(producto => producto.nombre !== nombre);
        
        // Actualizar la lista de productos en línea en el DOM
        listaProductosEnLinea.innerHTML = '';
        productosEnLinea.forEach(producto => {
            const productItemEnLinea = document.createElement('div');
            productItemEnLinea.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <p>${producto.descripcion}</p>
                <p>Stock: ${producto.stock}</p>
                <img src="${producto.fotoURL}"> <!-- Mostrar la imagen -->
                <button class="eliminarProductoBtn" data-nombre="${producto.nombre}">Eliminar</button>
            `;
            if (producto.esOferta) {
                productItemEnLinea.classList.add('oferta');
                productItemEnLinea.innerHTML += `<span class="badge">Oferta</span>`;
            }
            listaProductosEnLinea.appendChild(productItemEnLinea);
        });

        // Actualizar la lista de precios en el DOM
        listaPrecios.innerHTML = '';
        productosEnLinea.forEach(producto => {
            const precioItem = document.createElement('div');
            precioItem.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: <input type="number" value="${producto.precio}" class="precio-input" data-nombre="${producto.nombre}"></p>
                <p>Descripción: <textarea class="descripcion-input" data-nombre="${producto.nombre}">${producto.descripcion}</textarea></p>
                <p>Stock: ${producto.stock}</p>
                <img src="${producto.fotoURL}"> <!-- Mostrar la imagen -->
            `;
            if (producto.esOferta) {
                precioItem.classList.add('oferta');
            }
            listaPrecios.appendChild(precioItem);
        });
    }

    // Evento delegado para manejar el clic en los botones de eliminación
    listaProductosEnLinea.addEventListener('click', function(event) {
        if (event.target.classList.contains('eliminarProductoBtn')) {
            const nombre = event.target.getAttribute('data-nombre');
            eliminarProducto(nombre);
        }
    });
});
