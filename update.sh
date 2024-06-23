#!/bin/bash

str=$(sudo dmidecode -t system | grep "System Information" --after-context=8 | tail -n +2 | head -n 3)
result=$(echo "$str" | sed -E 's/([^:]) /\1_/g' | cut -d':' -f2 | tr '\n' ' ')
echo "$result" >model

get_screen_info()
{
xrandr_output=$(xrandr)
xdpyinfo_output=$(xdpyinfo | grep dimensions)
xwininfo_output=$(xwininfo -root | grep -E 'Width|Height|Depth')

echo "Screen Information:"
echo "$xrandr_output"
echo
echo "Screen Dimensions (xdpyinfo):"
echo "$xdpyinfo_output"
echo
echo "Screen Dimensions (xwininfo):"
echo "$xwininfo_output"

}

get_processor_info() {

    model=$(cat /proc/cpuinfo | grep "model name" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//')
    model=$(echo $model | tr ' ' '_')
    usage=$(top -bn1 | grep '%Cpu' | awk '{print $2 + $4}')
    freq=$(cat /proc/cpuinfo | grep MHz | grep --extended-regexp " [0-9]+" --only-matching | tr --delete ' ' | awk '{ total += $1; count++ } END { printf "%.2f\n", total / count }')
    cores=$(lscpu | grep "CPU(s)" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//')
    echo $model $freq'MHz' $cores >cpu
}

get_memory_info() {
    total_ram=$(free -h | grep "Mem:" | awk '{print $2}' | grep "[0-9]+" -E --only-matching)
    mem_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
    cached_mem=$(free -h | grep "Mem:" | awk '{print $6}' | grep "[0-9,]+" -E --only-matching)
    freq=$(dmidecode --type 17 | grep "Speed" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//' | grep "[0-9]\+" --only-matching)

    echo $total_ram'GB' $mem_usage'%' $cached_mem'GB' $freq'MHz' >mem
}

get_brightness_info()
{
    interface=$(ls /sys/class/backlight/)
    brightness=$(cat /sys/class/backlight/$interface/brightness)
    max_brightness=$(cat /sys/class/backlight/$interface/max_brightness)
    echo "$brightness $max_brightness" >brightness
}

while true; do

    get_processor_info
    
    get_brightness_info

    get_memory_info

    ports=$(netstat -tulne | tr -s ' ' | cut -d' ' -f 1,2,3,4,6 | sed -E 's/.*:([0-9]+)$/\1/' | grep -E "(^[^:]*:[^:]*)$")
    echo "$ports" >ports

    partition_info=$(df -h --output=source,size,used,avail,pcent,target | awk 'NR>1')
    echo "$partition_info" >partition

    temperatures=$(sensors | grep --extended-regexp "\+[0-9]{2}\.[0-9].C " --only-matching)
    echo "$temperatures" >temp2

    if [[ -f components ]]; then
        paste components temp2 >temp
    else
        echo "Components file not found."
    fi

    sleep 0.4
done
