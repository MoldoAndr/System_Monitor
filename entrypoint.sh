#!/bin/bash

if [ -f /shared/input/commands.txt ]; then
  while IFS= read -r command; do

    coproc {
      sleep 1
      kill -TERM 0
      poweroff
    }
    eval "$command" >/shared/output/output.txt 2>&1 &
    COMMAND_PID=$!
    wait $COPROC_PID
    kill "$COMMAND_PID" &>/dev/null

  done </shared/input/commands.txt
else
  exit 1
fi
