<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

if (isset($_GET['command'])) {
    // Extract command and arguments
    $fullCommand = $_GET['command'];

    $commandString = "\"$fullCommand\"";

    $output = shell_exec("sudo ./dock_commands.sh $commandString 2>&1");

    if ($output === null) {
        http_response_code(500);
        echo "Error executing command: $commandString";
    } else {
        echo "<pre>$output</pre>";
    }
} else {
    http_response_code(400);
    echo "Command not specified";
}
?>