#!/bin/bash

# Auto-restart script for Next.js development server
echo "Starting auto-restart development server..."

while true; do
    echo "$(date): Starting Next.js development server..."
    npm run dev
    
    echo "$(date): Server stopped. Restarting in 3 seconds..."
    sleep 3
done