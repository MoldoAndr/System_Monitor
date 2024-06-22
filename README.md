Sistem de Monitorizare Web

Sistem de monitorizare web care ruleaza pe localhost la portul 3000. Sistemul poate executa comenzi izolate intr-un container Docker si poate programa cronjob-uri. Proiectul foloseste HTML, CSS și JS pentru front-end si PHP si JS pentru back-end. Comenzile si cronjob-urile sunt gestionate prin shell script-uri.

Caracteristici

Monitorizare in timp real a sistemului.
Executia izolata a comenzilor într-un container Docker.
Programarea si gestionarea cronjob-urilor.
Interfata web usor de utilizat.
Parsarea comenzilor host->docker si a rezultatului docker->host

Tehnologii Utilizate

HTML: Structura paginii web.
CSS: Stilizarea paginii web.
JavaScript: Functionalitati dinamice pe partea de client cat si server.
PHP: Logica serverului și manipularea datelor.
Shell Script (sh): Gestionarea comenzilor si cronjob-urilor.
Docker: Izolarea executiei comenzilor.
Cron: Programarea executiei periodice a sarcinilor.

Cerinte

Make
Docker
PHP
Apache2
Crontab
NodeJS

Build: Pentru dependintele necesare rulati sudo ./build.sh build.log
