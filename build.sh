#!/bin/bash

declare -i error_less=0

if [[ $# -ne 1 ]]; then
    echo "usage: ./build.sh build_log_file"
    exit 1
else
    #Dependente necesare
    sudo apt install libudev-dev acpi make php8.1 python3.10 gcc g++ build-essential ca-certificates curl iproute2 cron -y &>>$1
    ((error_less += $?))
    sudo apt update &>>$1
    pip install psutil &>>$1
    ((error_less += $?))

    #Docker
    sudo install -m 0755 -d /etc/apt/keyrings &>>$1
    ((error_less += $?))
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc &>>$1
    ((error_less += $?))
    sudo chmod a+r /etc/apt/keyrings/docker.asc &>>$1
    ((error_less += $?))
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" |
        sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
    sudo apt-get update &>>$1
    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin &>>$1
    ((error_less += $?))
    sudo service docker start &>>$1
    ((error_less += $?))
    #crearea docker-ului sanitize pe baza Dockerfile-ului
    sudo docker build . -t sanitize &>>$1
    ((error_less += $?))

    #Usb Monitor
    gcc -o usb_monitor monitor.c -ludev &>>$1
    ((error_less += $?))

    #Network Interface
    ip a | grep "state UP" | grep "[0-9]: [a-z0-9]*" --only-matching | cut -d' ' -f2 >net_int
    ((error_less += $?))
    gcc -o network_traffic network_capture.c &>>$1
    ((error_less += $?))

    if [[ $error_less -eq 0 ]]; then
        echo Instalarea dependintelor a fost un succes
        echo Pentru a porni monitorul rulati comanda "make"
        mkdir ./shared &>/dev/null
        mkdir ./shared/input &>/dev/null
        mkdir ./shared/output &>/dev/null
        touch ./shared/input/commands.txt &>/dev/null
        touch ./shared/output/output.txt &>/dev/null
        sudo rm $1
        sleep 5
        clear
        exit 0
    else
        echo A avut loc o eroare la instalarea dependintelor
        echo Verificati fisierul $1 pentru mai multe informatii
        sleep 5
        clear
        exit 1
    fi

fi
