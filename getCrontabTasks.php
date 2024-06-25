<?php
header('Content-Type: text/plain');
$output = shell_exec('sudo crontab -l');
if ($output !== null) {
    echo $output;
} else {
}