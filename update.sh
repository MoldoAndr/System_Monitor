#!/bin/bash

while true; do
    
	cpu_usage=$(top -bn 1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
    	echo "CPU Usage: $cpu_usage%" > cpu

    	mem_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
    	echo "Memory Usage: $mem_usage%" > mem

    	top_processes=$(ps -eo pid,ppid,%cpu,%mem, --sort=-%cpu | awk 'NR>1' | head -n 10)
    	echo "$top_processes" > proc

    	partition_info=$(df -h --output=source,size,used,avail,pcent,target | awk 'NR>1')
    	echo "$partition_info" > partition

    	sleep 0.2
done

