#!/bin/bash
if [ -f /shared/input/commands.txt ]; then
  while IFS= read -r command; do
    eval "$command" > /shared/output/output.txt 2>&1
  done < /shared/input/commands.txt
else
  exit 1
fi
