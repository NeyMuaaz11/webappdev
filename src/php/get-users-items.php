<?php
include 'config.php';

$userId = $_GET['userId'];

$sql = "SELECT name, price FROM products WHERE user_id = $userId";


$result = $conn->query($sql);

$items = array();
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode($items);

$conn->close();
?>