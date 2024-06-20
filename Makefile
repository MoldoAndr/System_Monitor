all:
	sudo ./update.sh &
	sudo ./add_tasks_from_file.sh &
	./network_traffic &
	php -S localhost:3000 > output.log 2>&1 &
die:
	sudo pkill -f php
	sudo pkill -f bash
	sudo pkill -f update
