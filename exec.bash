#!/bin/bash

# Brief description of your script
# Copyright 2023 samuel

#######################################
# Main function
# Arguments:
#  None
#######################################
function main() {
  cd nsfwpy && pipenv run flask run --port 4042
}

main "$@"
