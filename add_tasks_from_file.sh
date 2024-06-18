#!/bin/bash

ADD_CRON_TASK_SCRIPT="./add_to_crontab.sh"
TASKS_FILE="./tasks.txt"

cron_job_exists() {
    local job="$1"
    crontab -l 2>/dev/null | grep -Fxq "$job"
    return $?
}

add_tasks_from_file() {
    while read text; do
	    command=$(echo $text | cut -d',' -f1)
	    datetime=$(echo $text | cut -d',' -f2)
	if [ -f "$command" ]; then
            year=$(echo $datetime | cut -d'T' -f1 | cut -d'-' -f1)
            month=$(echo $datetime | cut -d'T' -f1 | cut -d'-' -f2)
            day=$(echo $datetime | cut -d'T' -f1 | cut -d'-' -f3)
            hour=$(echo $datetime | cut -d'T' -f2 | cut -d':' -f1)
            minute=$(echo $datetime | cut -d'T' -f2 | cut -d':' -f2)
            cron_job="$minute $hour $day $month * $command"

            if ! cron_job_exists "$cron_job"; then
                $ADD_CRON_TASK_SCRIPT "$text"
            fi
        fi
    done < "$TASKS_FILE"
}

while true; do
    add_tasks_from_file
    sleep 1
done

