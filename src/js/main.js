$(document).ready(function () {
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Login form submission
    $('.login-form').on('submit', function (event) {
        event.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        $.post('php/login.php', { username, password }, function (data) {
            const response = JSON.parse(data);
            if (response.success) {
                localStorage.setItem('loggedInUser', JSON.stringify(response.user));
                window.location.href = 'home.html';
            } else {
                alert('Invalid username or password.');
            }
        });
    });

    // Registration form submission
    $('.register-form').on('submit', function (event) {
        event.preventDefault();
        const newUser = {
            fullname: $('#register-fullname').val(),
            email: $('#register-email').val(),
            username: $('#register-username').val(),
            password: $('#register-password').val()
        };

        $.post('php/register.php', newUser, function (data) {
            const response = JSON.parse(data);
            if (response.success) {
                alert('Registration successful! You can now log in.');
                window.location.href = 'index.html';
            } else {
                alert(response.message);
            }
        });
    });

    // Fetch and display user account info
    if (window.location.pathname.endsWith('account.html')) {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            $('#account-name').text(user.fullname);
            $('#account-email').text(user.email);
            $('#account-address').text(user.address);
            $('#account-phone').text(user.phone);
        } else {
            window.location.href = 'index.html';
        }
    }

    // Fetch and display categories
    if (window.location.pathname.endsWith('categories.html')) {
        $.get('php/get_categories.php', function (data) {
            const categories = JSON.parse(data);
            categories.forEach(category => {
                $('.category-list').append(`<a href="category-details.html?category=${category.name}"><li>${category.name}</li></a>`);
            });
        });
    }

    // Fetch and display category details
    if (window.location.pathname.endsWith('category-details.html')) {
        const params = new URLSearchParams(window.location.search);
        const categoryName = params.get('category');

        $.get('php/get_category_items.php', { category: categoryName }, function (data) {
            const category = JSON.parse(data);
            if (category) {
                $('#category-title').text(category.name);
                category.items.forEach(item => {
                    $('.category-items').append(`
                        <div class="category-item">
                            <h3>${item.name}</h3>
                            <p>Price: $${item.price}</p>
                            <button class="add-to-cart-button" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
                        </div>
                    `);
                });
            }
        });
    }

    // Add item to cart
    $(document).on('click', '.add-to-cart-button', function () {
        const itemId = $(this).data('id');
        const itemName = $(this).data('name');
        const itemPrice = $(this).data('price');
        const item = cart.find(i => i.id === itemId);

        if (item) {
            item.quantity++;
        } else {
            cart.push({ id: itemId, name: itemName, price: itemPrice, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${itemName} has been added to your cart.`);
    });

    // Display cart items
    if (window.location.pathname.endsWith('cart.html')) {
        let totalItems = 0;
        let totalCost = 0;

        cart.forEach(item => {
            totalItems += item.quantity;
            totalCost += item.price * item.quantity;
            $('.cart-items').append(`
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <button class="remove-button" data-id="${item.id}">Remove</button>
                </div>
            `);
        });

        $('#total-items').text(totalItems);
        $('#total-cost').text(totalCost.toFixed(2));
    }

    // Remove item from cart
    $(document).on('click', '.remove-button', function () {
        const itemId = $(this).data('id');
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.reload();
    });

    // Logout
    $('.logout-button button').on('click', function () {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });

    $('#add-product-form').on('submit', function (event) {
        event.preventDefault();

        const productName = $('#product-name').val();
        const productPrice = $('#product-price').val();
        const productCategory = $('#product-category').val();

        $.post('php/add-product.php', {
            name: productName,
            price: productPrice,
            category_id: productCategory
        }, function (response) {
            alert(response);
            window.location.href = 'home.html';
        });
    });

    if (window.location.pathname.endsWith('add-product.html')) {
        // Fetch categories and populate the select element
        $.get('../php/fetch-categories.php', function (data) {
            const categories = JSON.parse(data);
            const categorySelect = $('#product-category');
            categories.forEach(category => {
                categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
            });
        });
    }


    // Checkout form submission
    $('#checkout-form').submit(function (e) {
        e.preventDefault();
        const formData = $(this).serializeArray();
        const orderData = {};
        formData.forEach(field => {
            orderData[field.name] = field.value;
        });

        const user = JSON.parse(localStorage.getItem('loggedInUser'));

        $.post('php/checkout.php', { cart: JSON.stringify(cart), order: JSON.stringify(orderData), user: JSON.stringify(user) }, function (data) {
            const response = JSON.parse(data);
            if (response.success) {
                alert('Order placed successfully!');
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                window.location.href = 'home.html';
            } else {
                alert('Failed to place order.');
            }
        });
    });

    // Update cart display function
    function updateCartDisplay() {
        $('.cart-items').empty();
        let totalItems = 0;
        let totalCost = 0;

        cart.forEach(item => {
            $('.cart-items').append(`
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <button class="remove-button" data-id="${item.id}">Remove</button>
                </div>
            `);
            totalItems += item.quantity;
            totalCost += item.price * item.quantity;
        });

        $('#total-items').text(totalItems);
        $('#total-cost').text(totalCost.toFixed(2));
    }

    if ($('.cart-items').length) {
        updateCartDisplay();
    }
});
