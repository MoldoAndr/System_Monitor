all:
	sudo ./update.sh &> /dev/null &> /dev/null &
	sudo ./network_traffic &> /dev/null &
	sudo ./usb_monitor &> /dev/null &
	sudo ./battery_info.sh &> /dev/null &
	sudo  python3 procs.py &> /dev/null &
	php -S localhost:3000 > output.log 2> /dev/null &
die:
	sudo pkill -f battery_info
	sudo pkill -f network_traffic
	sudo pkill -f procs
	sudo pkill -f php
	sudo pkill -f bash
	sudo pkill -f update
	sudo pkill -f python
	sudo pkill -f usb_monitor
	sudo pkill -f docker
