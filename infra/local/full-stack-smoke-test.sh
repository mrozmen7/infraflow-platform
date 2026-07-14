#!/usr/bin/env bash
set -euo pipefail

# Requires the local PostgreSQL container and Spring Boot API to be running.
# It does not mutate incidents, assets or work orders. The agent proposal check creates an audit event.
base_url="${INFRAFLOW_API_BASE_URL:-http://localhost:8080}"
token="$(curl -fsS -X POST "$base_url/api/v1/auth/login" -H 'Content-Type: application/json' -d '{"username":"admin","password":"admin"}' | sed -E 's/.*"accessToken":"([^"]+)".*/\1/')"

curl -fsS "$base_url/actuator/health" | grep -q 'UP'
curl -fsS "$base_url/api/v1/assets" -H "Authorization: Bearer $token" | grep -q 'TRF-NT-003'
curl -fsS "$base_url/api/v1/work-orders" -H "Authorization: Bearer $token" | grep -q 'WO-'
curl -fsS "$base_url/api/v1/agent-sessions/incidents/INC-2026-0001" -H "Authorization: Bearer $token" | grep -q 'mock-rule-runtime'
printf 'Full-stack smoke test passed: PostgreSQL-backed API authentication, assets, work orders and the provider-neutral agent proposal are reachable.\n'
