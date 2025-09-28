<?php
$servername = "localhost:3307"; // Usually 'localhost' or an IP address
$username = "root"; // Replace with your MySQL username
$password = ""; // Replace with your MySQL password
$dbname = "pari_01"; // Replace with your database name (SponsoLink/Pari-vaar)

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    // Stop execution and display a user-friendly error
    die("Connection failed: " . $conn->connect_error);
}

echo "connected succesfully";

?>