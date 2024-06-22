import time
import signal
import sys
import os
import psutil

output_file = "procs.txt"
temp_file = "procs_temp.txt"
cpu_usage_file = "cpu_usage_temp"

def cleanup(signal, frame):
    print("Terminating script...")
    sys.exit(0)

signal.signal(signal.SIGINT, cleanup)

with open(temp_file, "w") as f:
    f.write("")

num_physical_cores = psutil.cpu_count(logical=False)

while True:
    with open(temp_file, "w") as f:

        cpu_percent_per_core = psutil.cpu_percent(percpu=True)
        procs = [(p.pid, p.info.get('cpu_percent', None), p.info.get('name', 'Unknown'), p.info.get('memory_percent', None)) 
                 for p in psutil.process_iter(['cpu_percent', 'name', 'memory_percent'])]
        procs = [(pid, cpu_percent, name, mem_percent) 
                 for pid, cpu_percent, name, mem_percent in procs if cpu_percent is not None and mem_percent is not None]
        procs.sort(key=lambda x: x[1], reverse=True)
        for pid, cpu_percent, name, mem_percent in procs[:20]:
            f.write(f"{pid} {cpu_percent/16:.2f} {mem_percent:.2f} {name}\n")

    try:
        os.replace(temp_file, output_file)
    except Exception as e:
        print(f"Error renaming file: {e}")

    with open(cpu_usage_file, "w") as f_cpu:
        for i, cpu_usage in enumerate(cpu_percent_per_core):
            f_cpu.write(f"{cpu_usage:.1f} ")
    os.replace(cpu_usage_file,"cpu_usage")

    with open("cpu_usage_total_temp","w") as f3:
        total_cpu=psutil.cpu_percent()
        f3.write(f"{total_cpu:}%")
    os.replace("cpu_usage_total_temp","cpu_usage_total")
    
    time.sleep(0.4)