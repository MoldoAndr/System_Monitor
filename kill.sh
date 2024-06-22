#!/bin/bash

search_word=$1

if [ -z "$search_word" ]; then
    exit 1
fi

matching_processes=$(pgrep -f "$search_word")

if [ -z "$matching_processes" ]; then
    exit 0
fi

ps -fp $matching_processes

sudo pkill -f "$search_word"
