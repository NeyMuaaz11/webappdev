<?php// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow methods (GET, POST, etc.) from the frontend
header("Access-Control-Allow-Methods: GET, POST");
// Allow headers from the frontend
header("Access-Control-Allow-Headers: Content-Type");
include 'config.php';

$sql = "SELECT * FROM categories";
$result = $conn->query($sql);
$categories = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
}

echo json_encode($categories);
$conn->close();
?>
