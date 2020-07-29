<?php
    include 'connection.php';

    if(mysqli_connect_errno()){
        echo "failed to connect";
    }

    $username = strtolower(htmlspecialchars($_POST["username"]));
    $password = hash('sha512',htmlspecialchars($_POST["password"]));
    $password2 = hash('sha512',htmlspecialchars($_POST["repeat-password"]));

    $query = "SELECT * FROM `user` WHERE name='$username'";
    if(mysqli_num_rows(mysqli_query($con,$query))>=1){
        echo "username already taken";
    }else{
        if(mysqli_query($con,$query)){
            if($password2==$password){
                $query = "INSERT INTO user(name,password) VALUES ('$username','$password')";
                mysqli_query($con, $query);
                echo "Registration Successful";
            }
            else{
                echo "passwords don't match";
            }
        }else{
            echo "oops! something went wrong";
        }
    }
?>