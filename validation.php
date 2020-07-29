<?php
    include 'connection.php';

    SESSION_START();

    if(mysqli_connect_errno()){
        echo "failed to connect";
    }

    $username = strtolower(htmlspecialchars($_POST["username"]));
    $password = hash('sha512',htmlspecialchars($_POST["password"]));

    //check same username
    $sql = "SELECT * FROM user WHERE name='$username' AND password='$password'";
    $res = mysqli_fetch_assoc(mysqli_query($con,$sql));
    if($res){
        $_SESSION['username'] = $username;
        echo "Success!";
    }else{
        echo "Login Failed!";
    }
?>