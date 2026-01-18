#!/usr/bin/env python3
"""
PasteBox Health Check Script

Checks the health of the PasteBox services and creates a test paste.
Usage: python scripts/healthcheck.py [--server URL] [--create-test]
"""

import argparse
import json
import sys
import urllib.request
import urllib.error
from datetime import datetime


class Colors:
    """ANSI color codes for terminal output."""
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'


def check_health(server_url: str) -> bool:
    """Check if the server health endpoint is responding."""
    try:
        url = f"{server_url}/health"
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data.get('status') == 'ok':
                print(f"{Colors.GREEN}✓ Server is healthy{Colors.END}")
                print(f"  Timestamp: {data.get('timestamp')}")
                return True
    except urllib.error.URLError as e:
        print(f"{Colors.RED}✗ Server health check failed: {e}{Colors.END}")
    except json.JSONDecodeError:
        print(f"{Colors.RED}✗ Invalid JSON response from server{Colors.END}")
    return False


def create_test_paste(server_url: str) -> dict | None:
    """Create a test paste and return its data."""
    test_paste = {
        "title": f"Health Check Test - {datetime.now().isoformat()}",
        "content": "// This is a test paste created by healthcheck.py\nconsole.log('Hello, PasteBox!');",
        "language": "javascript"
    }

    try:
        url = f"{server_url}/api/pastes"
        data = json.dumps(test_paste).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        with urllib.request.urlopen(req, timeout=10) as response:
            result = json.loads(response.read().decode())
            print(f"{Colors.GREEN}✓ Test paste created successfully{Colors.END}")
            print(f"  ID: {result.get('_id')}")
            print(f"  Title: {result.get('title')}")
            print(f"  Expires: {result.get('expiresAt')}")
            return result

    except urllib.error.HTTPError as e:
        print(f"{Colors.RED}✗ Failed to create paste: HTTP {e.code}{Colors.END}")
    except urllib.error.URLError as e:
        print(f"{Colors.RED}✗ Connection error: {e}{Colors.END}")
    return None


def verify_paste(server_url: str, paste_id: str) -> bool:
    """Verify that a paste can be retrieved."""
    try:
        url = f"{server_url}/api/pastes/{paste_id}"
        with urllib.request.urlopen(url, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data.get('id') == paste_id:
                print(f"{Colors.GREEN}✓ Paste verification successful{Colors.END}")
                return True
    except urllib.error.HTTPError as e:
        print(f"{Colors.RED}✗ Failed to retrieve paste: HTTP {e.code}{Colors.END}")
    except urllib.error.URLError as e:
        print(f"{Colors.RED}✗ Connection error: {e}{Colors.END}")
    return False


def main():
    parser = argparse.ArgumentParser(description='PasteBox Health Check')
    parser.add_argument(
        '--server',
        default='http://localhost:5000',
        help='Server URL (default: http://localhost:5000)'
    )
    parser.add_argument(
        '--create-test',
        action='store_true',
        help='Create a test paste to verify write operations'
    )
    args = parser.parse_args()

    print(f"{Colors.BLUE}PasteBox Health Check{Colors.END}")
    print(f"Server: {args.server}\n")

    # Check health endpoint
    if not check_health(args.server):
        sys.exit(1)

    # Optionally create and verify a test paste
    if args.create_test:
        print()
        paste = create_test_paste(args.server)
        if paste:
            verify_paste(args.server, paste['_id'])
        else:
            sys.exit(1)

    print(f"\n{Colors.GREEN}All checks passed!{Colors.END}")


if __name__ == '__main__':
    main()
