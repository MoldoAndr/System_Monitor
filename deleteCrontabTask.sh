#!/bin/bash
taskId=$1

currentCrontab=$(crontab -l)

if [ -z "$currentCrontab" ]; then
    echo "Error fetching current crontab."
    exit 1
fi
IFS=$'\n' read -rd '' -a lines <<<"$currentCrontab"
if [ "$taskId" -le 0 ] || [ "$taskId" -gt "${#lines[@]}" ]; then
    echo "Task ID out of range."
    exit 1
fi
unset 'lines[taskId-1]'

newCrontab=$(
    IFS=$'\n'
    echo "${lines[*]}"
)

echo "$newCrontab" | crontab -

echo "Task deleted successfully."
