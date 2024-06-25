<?php
header('Content-Type: text/plain');

// Get the task ID from the POST request
$taskId = isset($_POST['taskId']) ? intval($_POST['taskId']) : 0;

if ($taskId <= 0) {
    echo "Invalid Task ID.";
    exit;
}

// Sanitize the task ID
$taskId = escapeshellarg($taskId);

// Call the Bash script to delete the task
$output = shell_exec("./deleteCrontabTask.sh $taskId 2>&1");

if (strpos($output, "Task deleted successfully.") !== false) {
    echo "Task deleted successfully.";
} else {
    echo "Error: " . $output;
}