#!/bin/bash


if [[ $# -lt 1 ]]; then
    echo "USAGE $0 <SESSION ID>"
    exit 1
fi

SEQUENCER='http://34.64.236.141:3000'

curl -X POST \
    -H "Authorization: Bearer $1" \
    $SEQUENCER/lobby/try_contribute
