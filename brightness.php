<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['direction'])) {
        $direction = $_POST['direction'];
        if ($direction == 'up' || $direction == 'down') {
            $output = shell_exec("sudo ./modify_brightness.sh " . escapeshellarg($direction));
            echo "Brightness changed: " . $output;
        } else {
            echo "Invalid direction";
        }
    } else {
        echo "No direction provided";
    }
} else {
    echo "Invalid request method";
}