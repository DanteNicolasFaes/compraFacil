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
            const stock = document.getElementById('stockProducto').value; // Nuevo campo para el stock

            // Crear el elemento de producto solo en la lista de precios
            const precioItem = document.createElement('div');
            precioItem.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: <input type="number" value="${precio}" onchange="modificarPrecio(this, '${nombre}')"></p>
                <p>Descripción: <textarea onchange="modificarDescripcion(this, '${nombre}')">${descripcion}</textarea></p>
                <p>Stock: ${stock}</p> <!-- Agregar el stock -->
                <button onclick="eliminarProducto(this)">Eliminar</button>
            `;
            listaPrecios.appendChild(precioItem);

            // Agregar el producto a la lista de productos en línea
            const productItemEnLinea = document.createElement('div');
            productItemEnLinea.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: $${precio}</p>
                <p>${descripcion}</p>
                <p>Stock: ${stock}</p> <!-- Agregar el stock -->
            `;
            listaProductosEnLinea.appendChild(productItemEnLinea);

            productosEnLinea.push({
                nombre: nombre,
                precio: precio,
                descripcion: descripcion,
                stock: stock // Agregar el stock
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

            // Crear el elemento de producto en la lista de productos en línea
            const productItemEnLinea = document.createElement('div');
            productItemEnLinea.innerHTML = `
                <h3>${nombre}</h3>
                <p>Precio: $${nuevoPrecio}</p>
                <p>${nuevaDescripcion}</p>
            `;
            listaProductosEnLinea.appendChild(productItemEnLinea);

            productosEnLinea.forEach(producto => {
                if (producto.nombre === nombre) {
                    producto.precio = nuevoPrecio;
                    producto.descripcion = nuevaDescripcion;
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
function saveOffer() {
    const offerName = document.getElementById('offerName').value;
    const offerDescription = document.getElementById('offerDescription').value;
    const offerPrice = document.getElementById('offerPrice').value;
    const offerImage = document.getElementById('offerImage').files[0];

    const formData = new FormData();
    formData.append('name', offerName);
    formData.append('description', offerDescription);
    formData.append('price', offerPrice);
    formData.append('image', offerImage);

    fetch('/api/saveOffer', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              window.location.href = '/productsOnline';
          } else {
              alert('Error al guardar la oferta');
          }
      });
}


