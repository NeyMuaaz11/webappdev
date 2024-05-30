<?php
include 'config.php';

$category = $_GET['category'];
$sql = "SELECT products.id, products.name, products.price, users.fullname FROM categories
        JOIN products ON categories.id = products.category_id 
        JOIN users ON products.user_id = users.id
        WHERE categories.name = '$category'";
$result = $conn->query($sql);
$categoryItems = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categoryItems[] = $row;
    }
}

echo json_encode($categoryItems);
$conn->close();
?>