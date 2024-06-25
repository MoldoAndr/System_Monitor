#!/bin/bash

if [[ $1 == "up" ]]; then
    brightness_level=10
elif [[ $1 == "down" ]]; then
    brightness_level=-10
fi
actual_brightness=$(cat /sys/class/backlight/*/brightness)
new_brightness=$(($actual_brightness + $brightness_level))
echo "$new_brightness" > /sys/class/backlight/*/brightness