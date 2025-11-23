const socket = io();

const productsList = document.getElementById('products-list');
const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');

socket.on('productsUpdate', (products) => {
    productsList.innerHTML = '';
    if (products && products.length > 0) {
        products.forEach(product => {
            productsList.innerHTML += `
                <tr>
                    <th scope="row">${product.id}</th>
                    <td>${product.title}</td>
                    <td>$${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${product.code}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const idToDelete = e.target.getAttribute('data-id');
                Swal.fire({
                    title: '¿Estás seguro?',
                    text: `Vas a eliminar el producto con ID: ${idToDelete}`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        socket.emit('deleteProduct', idToDelete);
                    }
                });
            });
        });

    } else {
        productsList.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos en el inventario.</td></tr>';
    }
});

addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(addProductForm);
    const product = {};
    formData.forEach((value, key) => product[key] = value);

    socket.emit('newProduct', product);
    addProductForm.reset();

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Producto enviado',
        showConfirmButton: false,
        timer: 3000
    });
});

deleteProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const productIdToDelete = document.getElementById('productIdToDelete').value;

    Swal.fire({
        title: '¿Eliminar producto?',
        text: `¿Deseas eliminar el producto con ID ${productIdToDelete}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            socket.emit('deleteProduct', productIdToDelete);
            document.getElementById('productIdToDelete').value = '';
        }
    });
});

socket.on('error', (message) => {
    Swal.fire({
        title: '¡Operación Fallida!',
        text: message,
        icon: 'error',
        confirmButtonText: 'Entendido'
    });
});