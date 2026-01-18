# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do not** open a public issue
2. Email the maintainer or use GitHub's private vulnerability reporting
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Measures

PasteBox implements the following security measures:

- Input validation on all API endpoints
- MongoDB injection prevention via Mongoose
- CORS configuration for allowed origins
- Rate limiting recommended for production
- Content size limits (1MB max)
- Automatic paste expiration (TTL)

## Best Practices for Deployment

- Use environment variables for sensitive config
- Enable HTTPS in production
- Set up proper CORS origins
- Consider adding rate limiting
- Regular dependency updates
