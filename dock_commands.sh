echo "$1" > /var/www/html/shared/input/commands.txt
docker run -v /var/www/html/shared/input:/shared/input -v /var/www/html/shared/output:/shared/output sanitize
cat /var/www/html/shared/output/output.txt
