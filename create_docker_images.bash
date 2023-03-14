#!/bin/bash
#
# Brief description of your script
# Copyright 2023 samuel

#######################################
# Main function
# Arguments:
#  None
#######################################
function main() {
  local d
  # Traverse all the subdirectories of the current directory and execute the command
  for d in */; do
    local dir_name="${d%/}"

    # If Dockerfile is present in the directory, execute the command
    if [ -f "$dir_name/Dockerfile" ]; then
      echo "Building $dir_name"
      docker build -t "$dir_name" "$dir_name"
    fi
  done
}

main "$@"
