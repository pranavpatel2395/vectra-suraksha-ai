"""
Vectra Jansadak Suraksha AI - Local HTTP Server
Serves the dark-themed command-center web prototype with proper MIME types for ES6 modules
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for prototype development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    # Ensure correct MIME type for ES modules
    Handler.extensions_map.update({
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.json': 'application/json'
    })

    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"==================================================")
            print(f"Vectra Jansadak Suraksha AI Control Platform")
            print(f"Running locally at: http://localhost:{PORT}")
            print(f"Serving from: {DIRECTORY}")
            print(f"==================================================")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98 or e.errno == 10048: # Port in use, try alternate
            ALT_PORT = 8081
            with socketserver.TCPServer(("", ALT_PORT), Handler) as httpd:
                print(f"Port {PORT} busy, running at: http://localhost:{ALT_PORT}")
                httpd.serve_forever()
        else:
            raise e
