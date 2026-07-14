#!/usr/bin/env bash
set -euo pipefail

# Starts the complete local development stack in the correct order:
# PostgreSQL -> Spring Boot API -> Angular development server.
# The Angular server runs in the foreground; Ctrl+C stops only Angular.
# The API stays available for the next frontend start and can be stopped with stop-local.sh.

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
runtime_dir="${TMPDIR:-/tmp}/infraflow"
backend_pid_file="$runtime_dir/backend.pid"
backend_log_file="$runtime_dir/backend.log"

mkdir -p "$runtime_dir"

api_is_healthy() {
  curl --fail --silent --max-time 2 http://127.0.0.1:8080/actuator/health >/dev/null 2>&1
}

printf 'Starting InfraFlow PostgreSQL...\n'
docker compose -f "$repo_root/infra/postgres/compose.yml" up -d

if api_is_healthy; then
  printf 'Spring Boot API is already available at http://localhost:8080.\n'
else
  if [[ -f "$backend_pid_file" ]] && kill -0 "$(cat "$backend_pid_file")" 2>/dev/null; then
    printf 'Waiting for the existing Spring Boot API to become healthy...\n'
  else
    printf 'Starting Spring Boot API...\n'
    (
      cd "$repo_root/backend"
      nohup mvn spring-boot:run -Dspring-boot.run.profiles=local >"$backend_log_file" 2>&1 &
      echo $! >"$backend_pid_file"
    )
  fi

  for _ in {1..90}; do
    if api_is_healthy; then
      printf 'Spring Boot API is healthy.\n'
      break
    fi
    sleep 1
  done

  if ! api_is_healthy; then
    printf 'The Spring Boot API did not become healthy. Inspect %s\n' "$backend_log_file" >&2
    exit 1
  fi
fi

printf 'Starting Angular on http://localhost:4200...\n'
cd "$repo_root/frontend"

frontend_pid="$(lsof -nP -t -iTCP:4200 -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"
if [[ -n "$frontend_pid" ]]; then
  frontend_command="$(ps -p "$frontend_pid" -o command= 2>/dev/null || true)"
  if [[ "$frontend_command" == *"ng serve (infraflow-web)"* ]]; then
    printf 'InfraFlow Angular is already available at http://localhost:4200.\n'
    exit 0
  fi

  printf 'Port 4200 is occupied by another process. Stop it manually, then run this command again.\n' >&2
  exit 1
fi

exec npm start -- --port 4200
