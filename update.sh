#!/bin/bash

sudo dmidecode -t system | grep "System Information" --after-context=8 | tail -n +2 > model

get_processor_info() {
    model=$(cat /proc/cpuinfo | grep "model name" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//')
    model=$(echo $model | tr ' ' '_' )
    usage=$(top -bn1 | grep '%Cpu' | awk '{print $2 + $4}')
    freq=$(cat /proc/cpuinfo | grep MHz | grep --extended-regexp " [0-9]+" --only-matching | tr --delete ' ' | awk '{ total += $1; count++ } END { printf "%.2f\n", total / count }')

    cores=$(lscpu | grep "CPU(s)" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//')

    echo "$model $usage $freq $cores" > cpu
}

get_memory_info() {
    total_ram=$(free -h | grep "Mem:" | awk '{print $2}')
    mem_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
    freq=$(dmidecode --type 17 | grep "Speed" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//' | grep "[0-9]\+" --only-matching)

    echo "$total_ram $mem_usage $freq" > mem
}


while true; do
    
#	cpu_usage=$(mpstat 1 1 | awk '/Average/ {print 100 - $12}')
#   	echo "$cpu_usage%" > cpu

#   	mem_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
#   	echo "$mem_usage%" > mem
	
	get_processor_info;
	get_memory_info;

	top_processes=$(ps -eo pid,ppid,%cpu,%mem,comm --sort=-%cpu | awk 'NR>1' | head -n 10 | awk '{ print }')
	echo "$top_processes" > proc

    	partition_info=$(df -h --output=source,size,used,avail,pcent,target | awk 'NR>1')
    	echo "$partition_info" > partition
    
   	temperatures=$(sensors | grep --extended-regexp  "\+[0-9]{2}\.[0-9].C " --only-matching)
    	echo "$temperatures" > temp2

    if [[ -f components ]]; then
        paste components temp2 > temp
    else
        echo "Components file not found."
    fi

    sleep 0.2
done

