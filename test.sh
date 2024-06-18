get_processor_info() {
    model=$(cat /proc/cpuinfo | grep "model name" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//')
    model=$(echo $model | tr ' ' '_' )
    usage=$(top -bn1 | grep '%Cpu' | awk '{print $2 + $4}')
    freq=$(lscpu | grep "CPU MHz" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//')
    cores=$(lscpu | grep "CPU(s)" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//')

    echo "$model $usage $freq $cores"
}

get_memory_info() {
    total_ram=$(free -h | grep "Mem:" | awk '{print $2}')
    used_ram=$(free -h | grep "Mem:" | awk '{print $3}')
    freq=$(dmidecode --type 17 | grep "Speed" | head -n 1 | cut -d ':' -f 2 | sed 's/^ *//')

    echo "$total_ram $used_ram $freq"
}


get_processes_info() {

    processes=$(ps -eo pid,ppid,%cpu,%mem,comm --sort=-%cpu | head -n 6 | tail -n 5 | sed 's/ /|/g')

    echo "$processes"
}

while true;
do
sleep 1;
done
