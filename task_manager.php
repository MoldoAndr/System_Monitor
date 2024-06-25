<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

function add_task($taskName, $taskTime)
{
    $taskEntry = "$taskName,$taskTime\n";
    $command = "sudo ./add_to_crontab.sh $taskEntry";
    shell_exec($command);
}
function delete_task($taskIndex)
{
    $taskIndex = $taskIndex - 1;
    $get_cronjob = "sudo ./get_cronjob.sh $taskIndex";
    $cronjob = shell_exec($get_cronjob);
    $escaped_cron_job = escapeshellarg($cronjob);
    $command = "sudo ./delete_cronjob.sh $escaped_cron_job";
    shell_exec($command);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['taskName']) && isset($_POST['taskTime'])) {
        $taskName = $_POST['taskName'];
        $taskTime = $_POST['taskTime'];
        add_task($taskName, $taskTime);
        echo "Task added successfully";
    } elseif (isset($_POST['taskNumber'])) {
        $taskNumber = $_POST['taskNumber'];
        delete_task($taskNumber);
        echo "Task deleted successfully";
    } else {
        http_response_code(400);
        echo "Invalid request parameters";
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}