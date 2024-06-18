all:
	sudo ./update.sh &
	sudo ./add_tasks_from_file.sh &
	
die:
	sudo ./kill php
	sudo ./kill bash
	sudo ./kill update
