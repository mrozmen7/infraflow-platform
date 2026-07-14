#!/usr/bin/env bash
set -euo pipefail

runtime_dir="${TMPDIR:-/tmp}/infraflow"
backend_pid_file="$runtime_dir/backend.pid"

if [[ -f "$backend_pid_file" ]] && kill -0 "$(cat "$backend_pid_file")" 2>/dev/null; then
  kill "$(cat "$backend_pid_file")"
  printf 'Stopped the Spring Boot API.\n'
else
  printf 'No API process started by start-local.sh was found.\n'
fi

rm -f "$backend_pid_file"
