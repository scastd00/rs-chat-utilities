#!/bin/bash

source bin/activate && cd src && flask run --port "$PORT" --host "$HOST_ADDR"
