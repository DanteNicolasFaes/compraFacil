document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const listaProductos = document.getElementById('listaProductos');
    const listaProductosEnLinea = document.getElementById('listaProductosEnLinea');
    const listaPrecios = document.getElementById('listaPrecios');
    const mensajeExito = document.getElementById('mensajeExito');
    let productosEnLinea = []; // Lista para almacenar los productos en línea
    let cambiosPendientes = false;

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

            // Crear elemento de producto en la lista de precios
            const precioItem = document.createElement('div');
            precioItem.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: <input type="number" value="${precio}" onchange="modificarPrecio(this, '${nombre}')"></p>
                <p>Descripción: <textarea onchange="modificarDescripcion(this, '${nombre}')">${descripcion}</textarea></p>
                <p>Stock: ${stock}</p>
                <img src="${URL.createObjectURL(foto)}"> <!-- Mostrar la imagen -->
            `;
            listaPrecios.appendChild(precioItem);

            // Agregar producto a la lista de productos en línea
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
                fotoURL: URL.createObjectURL(foto) // Guardar URL de la imagen en los datos del producto
            });

            // Mostrar mensaje de éxito
            mensajeExito.innerText = "Producto agregado con éxito.";
            mensajeExito.style.display = 'block';
            setTimeout(() => {
                mensajeExito.style.display = 'none';
            }, 3000);

            // Resetear formulario de productos
            productForm.reset();
        });
    }

        // Función para eliminar producto
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
                    // Eliminar producto de la lista de productos en línea
                    productosEnLinea = productosEnLinea.filter(producto => producto.nombre !== productoNombre);
                }
            });
        };
    
        // Función para eliminar producto de la lista de productos en línea
        window.eliminarProductoEnLinea = function(nombre) {
            // Eliminar producto de la lista de productos en línea
            productosEnLinea = productosEnLinea.filter(producto => producto.nombre !== nombre);
    
            // Actualizar visualización de la lista de productos en línea
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
    
        // Función para modificar precio
        window.modificarPrecio = function(input, nombre) {
            cambiosPendientes = true;
        };
    
        // Función para modificar descripción
        window.modificarDescripcion = function(textarea, nombre) {
            cambiosPendientes = true;
        };
    
        // Función para guardar cambios en la lista de productos en línea
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

        // Función para mostrar una sección específica
        window.mostrarSeccion = function(seccion) {
            document.querySelectorAll('.seccion').forEach(function(section) {
                section.classList.remove('active');
                section.style.display = 'none';
            });
            document.getElementById(seccion).classList.add('active');
            document.getElementById(seccion).style.display = 'block';
        };
});

/*document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    const offerForm = document.getElementById('offerForm'); 
    const listaProductosEnLinea = document.getElementById('listaProductosEnLinea');
    const listaOfertas = document.getElementById('listaOfertas'); 
    const listaPrecios = document.getElementById('listaPrecios'); // Nueva variable para la lista de precios
    const mensajeExito = document.getElementById('mensajeExito');
    let productosEnLinea = []; 
    let ofertasEnLinea = []; 

    // Evento de envío del formulario de productos
    if (productForm) {
        productForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Obtener valores del formulario de productos
            const nombre = document.getElementById('nombreProducto').value;
            const precio = document.getElementById('precioProducto').value;
            const descripcion = document.getElementById('descripcionProducto').value;
            const stock = document.getElementById('stockProducto').value;
            const foto = document.getElementById('fotoProducto').files[0]; 

            // Agregar producto a la lista de productos en línea
            productosEnLinea.push({
                nombre: nombre,
                precio: precio,
                descripcion: descripcion,
                stock: stock,
                fotoURL: URL.createObjectURL(foto) 
            });

            // Mostrar mensaje de éxito
            mensajeExito.innerText = "Producto agregado con éxito.";
            mensajeExito.style.display = 'block';
            setTimeout(() => {
                mensajeExito.style.display = 'none';
            }, 3000);

            // Resetear formulario de productos
            productForm.reset();

            // Actualizar visualización de la lista de productos en línea
            actualizarListaProductosEnLinea();

            // Agregar precio del producto a la lista de precios
            const precioItem = document.createElement('div');
            precioItem.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: <input type="number" value="${precio}" onchange="modificarPrecio(this, '${nombre}')"></p>
                <p>Descripción: <textarea onchange="modificarDescripcion(this, '${nombre}')">${descripcion}</textarea></p>
                <p>Stock: ${stock}</p>
                <img src="${URL.createObjectURL(foto)}"> 
            `;
            listaPrecios.appendChild(precioItem);
        });
    }

    // Evento de envío del formulario de ofertas
    if (offerForm) {
        offerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Obtener valores del formulario de ofertas
            const nombre = document.getElementById('nombreOferta').value;
            const precio = document.getElementById('precioOferta').value;
            const descripcion = document.getElementById('descripcionOferta').value;
            const stock = document.getElementById('stockOferta').value;
            const foto = document.getElementById('fotoOferta').files[0]; 

            // Agregar oferta a la lista de ofertas en línea
            ofertasEnLinea.push({
                nombre: nombre,
                precio: precio,
                descripcion: descripcion,
                stock: stock,
                fotoURL: URL.createObjectURL(foto) 
            });

            // Mostrar mensaje de éxito
            mensajeExito.innerText = "Oferta agregada con éxito.";
            mensajeExito.style.display = 'block';
            setTimeout(() => {
                mensajeExito.style.display = 'none';
            }, 3000);

            // Resetear formulario de ofertas
            offerForm.reset();

            // Actualizar visualización de la lista de ofertas en línea
            actualizarListaOfertasEnLinea();

            // Agregar precio de la oferta a la lista de precios
            const precioItem = document.createElement('div');
            precioItem.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: <input type="number" value="${precio}" onchange="modificarPrecio(this, '${nombre}')"></p>
                <p>Descripción: <textarea onchange="modificarDescripcion(this, '${nombre}')">${descripcion}</textarea></p>
                <p>Stock: ${stock}</p>
                <img src="${URL.createObjectURL(foto)}"> 
            `;
            listaPrecios.appendChild(precioItem);
        });
    }

    // Función para eliminar producto de la lista de productos en línea
    window.eliminarProductoEnLinea = function(nombre) {
        productosEnLinea = productosEnLinea.filter(producto => producto.nombre !== nombre);
        actualizarListaProductosEnLinea();
    };

    // Función para eliminar oferta de la lista de ofertas en línea
    window.eliminarOfertaEnLinea = function(nombre) {
        ofertasEnLinea = ofertasEnLinea.filter(oferta => oferta.nombre !== nombre);
        actualizarListaOfertasEnLinea();
    };

    // Función para mostrar una sección específica
    window.mostrarSeccion = function(seccion) {
        document.querySelectorAll('.seccion').forEach(function(section) {
            section.classList.remove('active');
            section.style.display = 'none';
        });
        document.getElementById(seccion).classList.add('active');
        document.getElementById(seccion).style.display = 'block';
    };

    // Función para actualizar la lista de productos en línea
    function actualizarListaProductosEnLinea() {
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
    }

    // Función para actualizar la lista de ofertas en línea
    function actualizarListaOfertasEnLinea() {
        listaOfertas.innerHTML = '';
        ofertasEnLinea.forEach(oferta => {
            const offerItemEnLinea = document.createElement('div');
            offerItemEnLinea.innerHTML = `
                <h3>${oferta.nombre}</h3>
                <p>Precio: $${oferta.precio}</p>
                <p>${oferta.descripcion}</p>
                <p>Stock: ${oferta.stock}</p>
                <img src="${oferta.fotoURL}"> <!-- Mostrar la imagen -->
                <button onclick="eliminarOfertaEnLinea('${oferta.nombre}')">Eliminar</button>
            `;
            listaOfertas.appendChild(offerItemEnLinea);
        });
    }
});*/