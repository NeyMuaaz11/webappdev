<?php// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow methods (GET, POST, etc.) from the frontend
header("Access-Control-Allow-Methods: GET, POST");
// Allow headers from the frontend
header("Access-Control-Allow-Headers: Content-Type");
include 'db_connection.php';

$name = $_POST['name'];
$price = $_POST['price'];
$category_id = $_POST['category_id'];

// Assuming logged-in user is stored in session
session_start();
$user_id = $_SESSION['user_id'];

$sql = "INSERT INTO products (name, price, category_id, user_id) VALUES ('$name', '$price', '$category_id', '$user_id')";

if ($conn->query($sql) === TRUE) {
    echo "Product added successfully.";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>
