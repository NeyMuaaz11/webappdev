<?php
include 'config.php';

$name = $_POST['name'];
$price = $_POST['price'];
$category_id = $_POST['category_id'];
$user_id = $_POST['user_id'];

$sql = "INSERT INTO products (name, price, category_id, user_id) VALUES ('$name', '$price', '$category_id', '$user_id')";

if ($conn->query($sql) === TRUE) {
    echo "Product added successfully.";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>