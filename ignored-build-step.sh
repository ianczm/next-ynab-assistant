#!/bin/bash

if [ "$VERCEL_ENV" == "production" ]; then
  if ! git log -1 --pretty=%B | grep -q "\[skip-ci\]"; then
    exit 1
  fi
fi
