<?php
include 'config.php';

$sql = "SELECT products.id, products.name AS product_name, products.price, users.fullname AS uploaded_by, categories.name AS category_name
        FROM products
        JOIN users ON products.user_id = users.id
        JOIN categories ON products.category_id = categories.id
        ORDER BY products.name";

$result = $conn->query($sql);

$products = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

echo json_encode($products);

$conn->close();
?>