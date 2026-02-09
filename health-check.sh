#!/bin/bash

# Health check for the development server
SERVER_URL="http://localhost:3000"
MAX_RETRIES=3
RETRY_DELAY=2

check_server() {
    local attempt=1
    
    while [ $attempt -le $MAX_RETRIES ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$SERVER_URL" | grep -q "200\|404"; then
            echo "$(date): Server is responding normally"
            return 0
        fi
        
        echo "$(date): Server check failed (attempt $attempt/$MAX_RETRIES)"
        sleep $RETRY_DELAY
        ((attempt++))
    done
    
    echo "$(date): Server is not responding after $MAX_RETRIES attempts"
    echo "Restarting the server..."
    pkill -f "next dev" || true
    sleep 2
    npm run dev &
    echo "$(date): Server restarted"
}

# Run health check
check_server