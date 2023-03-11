#!/bin/bash

#
# Tests the nsfw endpoint with several images.
# Copyright 2023 samuel

#######################################
# Main function
# Arguments:
#  $1: Directory with images to test
#######################################
main() {
  local results_file="$1"/result.json
  echo "" > "$results_file"

  # Traverse images in a directory passed as parameter
  for file in "$1"/*; do
    if [[ "$file" == "$results_file" ]]; then
      continue
    fi

    local res
    res=$(curl -X POST -F "image=@$file" http://localhost:3000/api/v1/nsfw/image 2>/dev/null)

    # Prettify the json output
    echo "$res" | jq >> "$results_file"
  done
}

main /home/samuel/Downloads/PruebasNSFW
