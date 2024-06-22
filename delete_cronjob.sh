#!/bin/bash

delete_cron_job() {
    local cron_job="$1"
    (crontab -l | grep -v -E "$cron_job") | crontab -
    echo "Deleted cron job: $cron_job"
}

if [ $# -eq 0 ]; then
    echo "Usage: $0 <cron_job>"
    echo "Example: $0 '0 1 * * * /path/to/command'"
    exit 1
fi

cron_job="$1"
delete_cron_job "$cron_job"
