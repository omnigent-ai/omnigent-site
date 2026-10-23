#!/usr/bin/env bash
set -euo pipefail

source_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
destination_dir="$source_dir/../../public/examples/github-actions"
files=(
  review.yml review-single.yml triage.yml
  claude/config.yaml codex/config.yaml gateway/config.yaml
  validate_output.jq
)

for file in "${files[@]}"; do
  mkdir -p "$destination_dir/$(dirname "$file")"
  cp "$source_dir/$file" "$destination_dir/$file"
done
