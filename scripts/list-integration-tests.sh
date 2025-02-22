integration_tests=$(find tests/integration -type f -name "*.spec.ts" | jq -R -s -c 'split("\n")[:-1]')

echo "{ \"integration_tests_files\": $integration_tests }"
