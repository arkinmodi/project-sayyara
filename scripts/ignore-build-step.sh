#!/usr/bin/env bash

# exit 1 = build, exit 0 = skip build
# https://vercel.com/docs/concepts/projects/overview#ignored-build-step

if [[ -z $(git diff-tree --no-commit-id --name-only HEAD | grep "^src*") ]]; then
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
else
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
fi
