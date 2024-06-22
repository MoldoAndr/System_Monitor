all:
	sudo ./update.sh &
	sudo ./add_tasks_from_file.sh &
	sudo ./network_traffic &
	sudo ./usb_monitor &
	sudo  python3 procs.py &
	php -S localhost:3000 > output.log 2>&1 &
die:
	sudo pkill -f network_traffic
	sudo pkill -f procs
	sudo pkill -f php
	sudo pkill -f bash
	sudo pkill -f update
	sudo pkill -f python
	sudo pkill -f usb_monitor