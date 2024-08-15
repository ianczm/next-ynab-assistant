#!/bin/bash

# Get the branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Get the latest commit message
COMMIT_MSG=$(git log -1 --pretty=%B)

# Always run the build in production
if [ "$VERCEL_ENV" == "production" ]; then
  exit 1
fi

# Exit 0 if branch is not "develop" or "main", and [preview] is not in the latest commit message (no build)
if ! (grep -qE "^(develop|main)$" <<< "$BRANCH" && grep -q "\[preview\]" <<< "$COMMIT_MSG"); then
  exit 0
fi

# Exit 0 if [skip-ci] is in the latest commit message (no build)
if grep -q "\[skip-ci\]" <<< "$COMMIT_MSG"; then
  exit 0
fi

# Trigger a build
exit 1
