<?php
include 'config.php';

$id = $_GET["id"];

$sql = "SELECT name FROM categories WHERE categories.id = $id";
$result = $conn->query($sql);
$name = "";

if ($result->num_rows > 0) {
    $name = $result->fetch_assoc();
}

echo json_encode($name);
$conn->close();
?>