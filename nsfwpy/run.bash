#!/bin/bash

cd "$VIRTUAL_ENV"/src && flask run --port "$PORT" --host "$HOST_ADDR"
