<?php
session_start();
include 'db.php';

$user_email = trim($_POST['userEmail']);
$password = trim($_POST['userPassword']);


$stmt = $conn->prepare("SELECT user_id, email, password_hash, user_role  
                        FROM users 
                        WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();

    // Verify password (using password_hash from DB)
    if (password_verify($password, $row['password_hash'])) {
        // Store session variables
        $_SESSION['user_id'] = $row['user_id'];
        $_SESSION['email'] = $row['email'];
        $_SESSION['role'] = $row['user_role'];


        // Redirect based on role
        if ($row['user_role'] === 'Sponsor') {
            header("Location: sponsor_dashboard.php");
        } elseif ($row['user_role'] === 'Staff') {
            header("Location: staff_dashboard.php");
        } elseif ($row['user_role'] === 'Owner') {
            header("Location: owner_dashboard.php");
        } else {
            header("Location: dashboard.php"); // fallback
        }
        exit;
    } else {
        echo " Incorrect password.";
    }
} else {
    echo " No such user.";
}

$stmt->close();
$conn->close();
?>