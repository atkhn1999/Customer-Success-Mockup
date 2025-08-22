#!/bin/bash

echo "Customer Success Plan - Local Server Launcher"
echo "============================================="
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "Starting server with Python..."
    python3 server.py
elif command -v python &> /dev/null; then
    echo "Starting server with Python..."
    python server.py
# Check if Node.js is available
elif command -v node &> /dev/null; then
    echo "Python not found. Starting server with Node.js..."
    node server.js
else
    echo "ERROR: Neither Python nor Node.js was found on your system."
    echo "Please install Python 3 or Node.js to run the local server."
    echo ""
    echo "Install using your package manager:"
    echo "- Ubuntu/Debian: sudo apt-get install python3"
    echo "- MacOS: brew install python3"
    echo "- Or visit: https://www.python.org/downloads/"
    echo ""
    exit 1
fi