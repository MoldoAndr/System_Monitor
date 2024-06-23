#!/bin/bash

get_battery_status() {
    if [ -f /sys/class/power_supply/BAT0/status ] &&
    [ -f /sys/class/power_supply/BAT0/capacity ]; then
        STATUS=$(cat /sys/class/power_supply/BAT0/status)
        CAPACITY=$(cat /sys/class/power_supply/BAT0/capacity)
        TIME_LEFT=$(upower -i /org/freedesktop/UPower/devices/battery_BAT0 | grep "time to empty" | grep "[0-9,].*" -o | tr -d ' ')
        echo -e "$STATUS $CAPACITY% $TIME_LEFT" > $1
    else
        exit 1
    fi
}

while (true) do
    get_battery_status "battery_info"
    sleep 1
done