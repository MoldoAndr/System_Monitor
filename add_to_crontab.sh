#!/bin/bash

add_to_crontab() {

    local command=$(echo $1 | cut -d',' -f1)
    local datetime=$(echo $1 | cut -d',' -f2)
    local year month day hour minute
    year=$(echo $datetime | cut -d'T' -f1 | cut -d'-' -f1)
    month=$(echo $datetime | cut -d'T' -f1 | cut -d'-' -f2)
    day=$(echo $datetime | cut -d'T' -f1 | cut -d'-' -f3)
    hour=$(echo $datetime | cut -d'T' -f2 | cut -d':' -f1)
    minute=$(echo $datetime | cut -d'T' -f2 | cut -d':' -f2)
    current_year=$(date +"%Y")
    current_month=$(date +"%m")
    current_day=$(date +"%d")
    current_hour=$(date +"%H")
    current_minute=$(date +"%M")

    future=0
    if [[ "$year" -eq "$current_year" ]]; then
        if [ "$month" -gt "$current_month" ]; then
            future=1
        elif [ "$month" -eq "$current_month" ]; then
            if [ "$day" -gt "$current_day" ]; then
                future=1
            elif [ "$day" -eq "$current_day" ]; then
                if [ "$hour" -gt "$current_hour" ]; then
                    future=1
                elif [ "$hour" -eq "$current_hour" ]; then
                    if [ "$minute" -gt "$current_minute" ]; then
                        future=1
                    fi
                fi
            fi
        fi
    fi

    if [ "$future" -eq 1 ]; then
        cron_job="$minute $hour $day $month * $command"
        (
            crontab -l 2>/dev/null
            echo "$cron_job"
        ) | crontab -
    fi
}
if [ "$#" -ne 1 ]; then
    exit 1
fi
input_command=$1
input_datetime=$2

add_to_crontab "$input_command" "$input_datetime"
