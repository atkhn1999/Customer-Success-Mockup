#!/usr/bin/env python3
"""
Simple HTTP Server for Customer Success Plan Application
This server provides local hosting with proper MIME types and CORS support.
"""

import http.server
import socketserver
import os
import sys
from http.server import SimpleHTTPRequestHandler

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Custom handler to set proper MIME types and enable CORS"""
    
    def end_headers(self):
        """Add custom headers for CORS and security"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def guess_type(self, path):
        """Ensure proper MIME types for all file types"""
        mimetype = super().guess_type(path)
        if path.endswith('.js'):
            mimetype = 'application/javascript'
        elif path.endswith('.css'):
            mimetype = 'text/css'
        elif path.endswith('.json'):
            mimetype = 'application/json'
        elif path.endswith('.woff') or path.endswith('.woff2'):
            mimetype = 'font/woff2'
        elif path.endswith('.ttf'):
            mimetype = 'font/ttf'
        return mimetype

def run_server(port=8080):
    """Run the HTTP server"""
    handler = CustomHTTPRequestHandler
    
    # Change to the directory containing this script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Server running at http://localhost:{port}/")
        print(f"Serving files from: {os.getcwd()}")
        print("\nPress Ctrl+C to stop the server")
        print("\nOpen http://localhost:{port}/index.html in your browser to view the application")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped.")
            sys.exit(0)

if __name__ == "__main__":
    # Check if port is provided as argument
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port number: {sys.argv[1]}")
            print("Usage: python server.py [port]")
            sys.exit(1)
    
    run_server(port)