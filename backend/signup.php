<?php
include 'db.php';

$a = $_POST['email'];
$b = password_hash($_POST['password'], PASSWORD_BCRYPT);


$sql = "INSERT INTO users (password_hash, email, ) VALUES ('$b', '$a')";

if ($conn->query($sql) === TRUE) 
    echo "✅ New user inserted successfully!" ;
else 
    echo "❌ Error: " . $conn->error;
$conn->close();
?>
