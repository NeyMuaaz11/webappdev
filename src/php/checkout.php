<?php// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
// Allow methods (GET, POST, etc.) from the frontend
header("Access-Control-Allow-Methods: GET, POST");
// Allow headers from the frontend
header("Access-Control-Allow-Headers: Content-Type");
include 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $cart = json_decode($_POST['cart'], true);
    $orderData = json_decode($_POST['order'], true);
    $user = json_decode($_POST['user'], true);

    $userId = $user['id'];
    $totalCost = array_reduce($cart, function($sum, $item) {
        return $sum + ($item['price'] * $item['quantity']);
    }, 0);

    // Insert into orders table
    $shippingAddress = $orderData['address'];
    $sql = "INSERT INTO orders (user_id, total_cost, shipping_address) VALUES ('$userId', '$totalCost', '$shippingAddress')";

    if ($conn->query($sql) === TRUE) {
        $orderId = $conn->insert_id;

        // Insert each cart item into order_items table
        foreach ($cart as $item) {
            $productId = $item['id'];
            $quantity = $item['quantity'];
            $price = $item['price'];
            $sql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ('$orderId', '$productId', '$quantity', '$price')";

            if (!$conn->query($sql)) {
                echo json_encode(["success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error]);
                $conn->close();
                exit;
            }
        }

        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error]);
    }

    $conn->close();
}
?>
