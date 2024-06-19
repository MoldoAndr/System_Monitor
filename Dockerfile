FROM ubuntu:latest

RUN apt-get update && apt-get install -y bash

RUN mkdir -p /shared/input /shared/output

WORKDIR /shared

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

