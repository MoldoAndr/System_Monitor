<?php
$crontab_output = shell_exec('sudo crontab -l | grep "^[*0-9]"');
header('Content-Type: application/json');
echo $crontab_output;