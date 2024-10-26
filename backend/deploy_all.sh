#!/bin/bash

# List all directories containing serverless.yaml except those in the skip list
skip_dirs=("speech-processing" "image-processing" "layers" "LAYERS" "standard" "API-Gateway" "SQS" "SNS" "go-example" "cognito" "dynamodb-events" "DynamoDB" "shared-authorizer")  # Add folder names to skip here

find . -type f -name "serverless.yml" | while read file_path; do
    dir=$(dirname "$file_path")
    
    # Check if the directory is in the skip list
    if [[ " ${skip_dirs[@]} " =~ " ${dir##*/} " ]] || [[ "$dir" =~ "node_modules" ]] || [[ "$dir" =~ "Migration" ]]; then
        echo "Skipping deployment for $dir"
    else
        echo "Deploying service in $dir"
        # (cd "$dir" && sls deploy --stage dev)
    fi
done