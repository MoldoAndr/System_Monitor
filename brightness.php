<?php
if (isset($_GET['direction'])) {
    $direction = $_GET['direction'];
    if ($direction == 'up' || $direction == 'down') {
        $output = shell_exec("sudo ./modify_brightness" . escapeshellarg($direction));
        echo "Brightness changed: " . $output;
    } else {
        echo "Invalid direction";
    }
} else {
    echo "No direction provided";
}
?>