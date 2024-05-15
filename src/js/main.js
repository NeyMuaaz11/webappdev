$(document).ready(function () {
    // Dummy user data
    const users = [
        { username: 'testuser', password: 'password', fullname: 'Test User', email: 'test@uni.de', address: 'college Ring', phone: '+111111232323232' }
    ];

    // Dummy categories data
    const categories = [
        {
            name: 'Electronics', items: [
                { name: 'Smartphone', price: 699 },
                { name: 'Laptop', price: 999 },
                { name: 'Headphones', price: 199 }
            ]
        },
        {
            name: 'Clothing', items: [
                { name: 'T-Shirt', price: 19 },
                { name: 'Jeans', price: 49 },
                { name: 'Jacket', price: 89 }
            ]
        },
        {
            name: 'Furniture', items: [
                { name: 'Sofa', price: 499 },
                { name: 'Dining Table', price: 299 },
                { name: 'Chair', price: 79 }
            ]
        },
        {
            name: 'Books', items: [
                { name: 'Fiction Novel', price: 14 },
                { name: 'Science Book', price: 29 },
                { name: 'History Book', price: 24 }
            ]
        },
        {
            name: '& Fitness', items: [
                { name: 'Dumbbells', price: 39 },
                { name: 'Yoga Mat', price: 19 },
                { name: 'Running Shoes', price: 69 }
            ]
        }
    ];

    // Initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    $('.login-form').on('submit', function (event) {
        event.preventDefault();
        const username = $('#login-username').val();
        const password = $('#login-password').val();
        const users = JSON.parse(localStorage.getItem('users'))
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'home.html';
        } else {
            alert('Invalid username or password.');
        }
    });

    $('.register-form').on('submit', function (event) {
        event.preventDefault();
        const newUser = {
            fullname: $('#register-fullname').val(),
            email: $('#register-email').val(),
            username: $('#register-username').val(),
            password: $('#register-password').val(),
            address: '',
            phone: ''
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! You can now log in.');
        window.location.href = 'index.html';
    });

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

    if (window.location.pathname.endsWith('categories.html')) {
        categories.forEach(category => {
            $('.category-list').append(`<a href="category-details.html?category=${category.name}"><li>${category.name}</li></a>`);
        });
    }

    if (window.location.pathname.endsWith('category-details.html')) {
        const params = new URLSearchParams(window.location.search);
        const categoryName = params.get('category');
        const category = categories.find(cat => cat.name === categoryName);

        if (category) {
            $('#category-title').text(categoryName);
            category.items.forEach(item => {
                $('.category-items').append(`
                    <div class="category-item">
                        <h3>${item.name}</h3>
                        <p>Price: $${item.price}</p>
                        <button class="add-to-cart-button" data-name="${item.name}" data-price="${item.price}">Add to Cart</button>
                    </div>
                `);
            });
        }
    }

    $(document).on('click', '.add-to-cart-button', function () {
        const itemName = $(this).data('name');
        const itemPrice = $(this).data('price');
        const item = cart.find(i => i.name === itemName);

        if (item) {
            item.quantity++;
        } else {
            cart.push({ name: itemName, price: itemPrice, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${itemName} has been added to your cart.`);
    });

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
                    <button class="remove-button" data-name="${item.name}">Remove</button>
                </div>
            `);
        });

        $('#total-items').text(totalItems);
        $('#total-cost').text(totalCost);
    }

    $(document).on('click', '.remove-button', function () {
        const itemName = $(this).data('name');
        cart = cart.filter(item => item.name !== itemName);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.reload();
    });

    $('.logout-button button').on('click', function () {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('cart');
    });

    $('#checkout-form').submit(function (e) {
        e.preventDefault();
        const formData = $(this).serializeArray();
        const orderData = {};
        formData.forEach(field => {
            orderData[field.name] = field.value;
        });

        alert('Order placed successfully!');

        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();

        window.location.href = 'home.html';
        console.log('After redirection');
    });

    if ($('.cart-items').length) {
        updateCartDisplay();
    }
});

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
                <button class="remove-button" data-name="${item.name}">Remove</button>
            </div>
        `);
        totalItems += item.quantity;
        totalCost += item.price * item.quantity;
    });

    $('#total-items').text(totalItems);
    $('#total-cost').text(totalCost.toFixed(2));
}
