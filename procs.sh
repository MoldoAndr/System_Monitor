#!/bin/bash

output_file="procs.txt"

# Ensure the output file is empty before starting
> "$output_file"

# Function to handle script termination
cleanup() {
    echo "Terminating script..."
    exit 0
}

# Trap the SIGINT (Ctrl+C) signal to call the cleanup function
trap cleanup SIGINT

# Run top in batch mode with a 0.2-second delay between updates
top -b -d 0.2 | awk -v outfile="$output_file" '
BEGIN {
    # Empty the output file at the start
    print "" > outfile
}

/^top -/ {
    # Print a separator for each iteration of top
    print "-----" >> outfile
}

NR > 7 && NR <= 17 {
    # Print the PID, CPU%, and command name for the top 10 processes
    printf "%s %s %s\n", $1, $9, $12 >> outfile
}
' 

