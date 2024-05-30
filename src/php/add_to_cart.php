<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow methods (GET, POST, etc.) from the frontend
header("Access-Control-Allow-Methods: GET, POST");
// Allow headers from the frontend
header("Access-Control-Allow-Headers: Content-Type");

session_start();

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$product_id = $_POST['product_id'];
$quantity = $_POST['quantity'];

if (isset($_SESSION['cart'][$product_id])) {
    $_SESSION['cart'][$product_id] += $quantity;
} else {
    $_SESSION['cart'][$product_id] = $quantity;
}

echo "Product added to cart.";
?>
