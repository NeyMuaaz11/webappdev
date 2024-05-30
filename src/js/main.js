$(document).ready(function () {
    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Login form submission
    $('.login-form').on('submit', function (event) {
        event.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();

        $.ajax({
            type: "POST",
            url: 'http://localhost:8000/php/login.php',
            data: { username: username, password: password },

            success: function (response) {
                localStorage.setItem('loggedInUser', response)
                window.location.href = "home.html"
            },
            error: function (response) {
                alert("Invalid username or password");  // Log any errors to the console
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

        $.ajax({
            type: "POST",
            url: 'http://localhost:8000/php/register.php',
            data: { fullname: newUser.fullname, email: newUser.email, username: newUser.username, password: newUser.password },

            success: function (response) {
                alert(response);  // Show the response from register.php
                window.location.href = "index.html"
            },
            error: function (xhr, status, error) {
                alert('Error:', error);  // Log any errors to the console
            }
        });
    });

    // Fetch and display user account info
    if (window.location.pathname.endsWith('account.html')) {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        console.log(user)
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
        $.ajax({
            type: "GET",
            url: 'http://localhost:8000/php/get_categories.php',

            success: function (response) {
                const categories = JSON.parse(response)
                categories.forEach(category => {
                    $('.category-list').append(`<a href="category-details.html?category=${category.name}"><li>${category.name}</li></a>`);
                });
            },
            error: function (xhr, status, error) {
                alert('Error:', error);  // Log any errors to the console
            }
        });
    }

    // Fetch and display category details
    if (window.location.pathname.endsWith('category-details.html')) {
        const params = new URLSearchParams(window.location.search);
        const categoryName = params.get('category');

        $.ajax({
            type: "GET",
            url: 'http://localhost:8000/php/get_category_items.php',
            data: { category: categoryName },

            success: function (response) {
                const items = JSON.parse(response);
                if (items) {
                    $('#category-title').text(categoryName);
                    items.forEach(item => {
                        $('.category-items').append(`
                        <div class="category-item">
                            <h3>${item.name}</h3>
                            <p>Price: $${item.price}</p>
                            <p>Uploaded by: ${item.fullname}</p>
                            <button class="add-to-cart-button" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
                        </div>
                    `);
                    });
                }
            },
            error: function (xhr, status, error) {
                alert("No items in this category!");  // Log any errors to the console
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

    $('#add-category-form').on('submit', function (event) {
        event.preventDefault();

        const name = $('#category-name').val();

        $.ajax({
            type: "POST",
            url: 'http://localhost:8000/php/add-category.php',
            data: { name: name },

            success: function (response) {
                alert(response);
                window.location.href = 'home.html';
            },
            error: function (xhr, status, error) {
                alert('Error:', error);  // Log any errors to the console
            }
        });
    });

    $('#add-product-form').on('submit', function (event) {
        event.preventDefault();

        const productName = $('#product-name').val();
        const productPrice = $('#product-price').val();
        const productCategory = $('#product-category').val();

        $.ajax({
            type: "POST",
            url: 'http://localhost:8000/php/add-product.php',
            data: { name: productName, price: productPrice, category_id: productCategory, user_id: JSON.parse(localStorage.getItem('loggedInUser')).id },

            success: function (response) {
                alert(response);
                window.location.href = 'home.html';
            },
            error: function (xhr, status, error) {
                alert('Error:', error);  // Log any errors to the console
            }
        });
    });

    if (window.location.pathname.endsWith('add-product.html')) {
        // Fetch categories and populate the select element
        $.ajax({
            type: "GET",
            url: 'http://localhost:8000/php/get_categories.php',

            success: function (response) {
                const categories = JSON.parse(response);
                const categorySelect = $('#product-category');
                categories.forEach(category => {
                    categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
                });
            },
            error: function (xhr, status, error) {
                alert('Error:', error);  // Log any errors to the console
            }
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

        $.ajax({
            type: "POST",
            data: { cart: JSON.stringify(cart), order: JSON.stringify(orderData), user: JSON.stringify(user) },
            url: 'http://localhost:8000/php/checkout.php',

            success: function (response) {
                alert('Order placed successfully!');
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                window.location.href = 'home.html';
            },
            error: function (xhr, status, error) {
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
