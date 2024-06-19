#!/bin/bash

echo "Current directory:"
pwd

echo "Contents of /shared/input:"
ls -l /shared/input

if [ -f /shared/input/commands.txt ]; then
  while IFS= read -r command; do
    eval "$command" >> /shared/output/output.txt 2>&1
  done < /shared/input/commands.txt
else
  echo "/shared/input/commands.txt does not exist"
  exit 1
fi

