#!/usr/bin/env python3
"""
Lightweight development web server for Clifton NJ Taxpayer Watchdog.
Serves the web application at http://localhost:8088
"""

import http.server
import socketserver
import os
import sys

PORT = 8088
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def get_lan_ip():
    import socket
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def run():
    socketserver.TCPServer.allow_reuse_address = True
    lan_ip = get_lan_ip()
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("\n" + "="*65)
        print(" 🏛️  CLIFTON NJ TAXPAYER WATCHDOG — LOCAL & NETWORK SERVER")
        print("="*65)
        print(f" • Local Machine:  http://localhost:{PORT}")
        print(f" • Local Network:  http://{lan_ip}:{PORT}")
        print("="*65)
        print(" (Share the Local Network link with any phone/computer on your Wi-Fi)\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            httpd.server_close()

if __name__ == '__main__':
    run()
