<?php// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow methods (GET, POST, etc.) from the frontend
header("Access-Control-Allow-Methods: GET, POST");
// Allow headers from the frontend
header("Access-Control-Allow-Headers: Content-Type");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "marketplace";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
