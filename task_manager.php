<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit();
}

function is_command_blacklisted($command)
{
    $blacklist = file('blacklist.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($blacklist as $blacklisted_command) {
        if (strpos($command, $blacklisted_command) !== false) {
            return true;
        }
    }
    return false;
}

function add_task($taskName, $taskTime)
{
    $taskEntry = "$taskName,$taskTime\n";
    file_put_contents('tasks.txt', $taskEntry, FILE_APPEND | LOCK_EX);
}

function delete_task($taskIndex)
{
    $tasks = file('tasks.txt', FILE_IGNORE_NEW_LINES);
    if (isset($tasks[$taskIndex - 1])) {
        $cron_job = $tasks[$taskIndex - 1];
        unset($tasks[$taskIndex - 1]);
        file_put_contents('tasks.txt', implode("\n", $tasks) . "\n");

        $output = shell_exec('crontab -l');
        $lines = explode("\n", trim($output));

        foreach ($lines as $key => $line) {
            if (strpos($line, $cron_job) !== false) {
                unset($lines[$key]);
                break;
            }
        }

        $updated_cron_content = implode("\n", $lines);
        file_put_contents('/tmp/crontab.txt', $updated_cron_content . "\n");
        shell_exec('crontab /tmp/crontab.txt');
        unlink('/tmp/crontab.txt');
        echo "Task and corresponding cron job deleted successfully";
    } else {
        echo "Error: Task index out of bounds";
    }
}

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
?>