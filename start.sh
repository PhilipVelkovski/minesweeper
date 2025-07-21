#!/bin/sh

# Start backend in background
node /app/backend/dist/index.js &

# Start nginx in foreground
nginx -g "daemon off;"
