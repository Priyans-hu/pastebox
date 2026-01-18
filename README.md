# PasteBox

A simple and efficient pastebin service for sharing code snippets with syntax highlighting. Built with React and Node.js.

![PasteBox](https://img.shields.io/badge/PasteBox-Share%20Code-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

## Features

- **Syntax Highlighting** - Support for 25+ programming languages
- **Auto-Expiration** - Pastes automatically delete after 7 days (MongoDB TTL)
- **Redis Caching** - Fast paste retrieval with intelligent cache invalidation
- **Copy Functions** - One-click copy for code and shareable links
- **Live Preview** - See syntax highlighting as you type
- **Dark Theme** - Easy on the eyes with Dracula-inspired theme
- **Responsive** - Works on desktop and mobile devices
- **Docker Ready** - One command deployment with docker-compose

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TailwindCSS 3, React Syntax Highlighter |
| **Backend** | Node.js 18+, Express 4.21 |
| **Database** | MongoDB 8 with TTL indexes |
| **Cache** | Redis 7 (optional, graceful fallback) |
| **Containerization** | Docker, docker-compose |
| **CI/CD** | GitHub Actions |

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and start all services
git clone https://github.com/Priyans-hu/PasteBox.git
cd PasteBox
docker-compose up -d

# App available at http://localhost:3000
```

### Option 2: Local Development

```bash
# Clone repository
git clone https://github.com/Priyans-hu/PasteBox.git
cd PasteBox

# Run setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Start MongoDB (if not running)
brew services start mongodb-community  # macOS
# or
sudo systemctl start mongod  # Linux

# Start server (terminal 1)
cd server && npm run dev

# Start client (terminal 2)
cd client && npm start
```

## Environment Variables

### Server (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pastebox
CLIENT_URL=http://localhost:3000

# Redis (optional - caching disabled if not set)
REDIS_URL=redis://localhost:6379
```

### Client (`client/.env`)

```env
REACT_APP_API_URL=http://localhost:5000
```

## API Reference

### Health Check

```bash
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "cache": { "enabled": true, "connected": true }
}
```

### Create a Paste

```bash
POST /api/pastes
Content-Type: application/json

{
  "content": "console.log('Hello World');",
  "language": "javascript",
  "title": "My Snippet"
}

Response: 201 Created
{
  "_id": "paste_id",
  "title": "My Snippet",
  "content": "console.log('Hello World');",
  "language": "javascript",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2024-01-08T00:00:00.000Z"
}
```

### Get a Paste

```bash
GET /api/pastes/:id

Response: 200 OK (cached if available)
{
  "id": "paste_id",
  "title": "My Snippet",
  "content": "console.log('Hello World');",
  "language": "javascript",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "expiresAt": "2024-01-08T00:00:00.000Z"
}
```

### Delete a Paste

```bash
DELETE /api/pastes/:id

Response: 200 OK
{ "message": "Paste deleted successfully" }
```

### Search Pastes

```bash
GET /api/pastes/search?q=query

Response: 200 OK
[{ "title": "...", "language": "...", "createdAt": "...", "expiresAt": "..." }]
```

## Caching Strategy

Redis caching is implemented for optimal performance:

| Operation | Cache Behavior |
|-----------|----------------|
| **GET paste** | Cache HIT returns instantly, MISS fetches from DB and caches |
| **CREATE paste** | Not cached (new pastes are fresh) |
| **DELETE paste** | Cache invalidated immediately |
| **Cache TTL** | Min(1 hour, paste expiration time) |

Cache is **optional** - the app works without Redis, just slower.

## Supported Languages

JavaScript, TypeScript, Python, Java, C, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, SQL, HTML, CSS, SCSS, JSON, YAML, XML, Markdown, Bash, Shell, Dockerfile, and Plain Text.

## Project Structure

```
PasteBox/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── constants/     # Language definitions
│   │   └── pages/         # Home, PastedCode
│   ├── Dockerfile         # Production build
│   └── nginx.conf         # Nginx config
├── server/                 # Express backend
│   ├── config/
│   │   ├── dbConnect.js   # MongoDB connection
│   │   └── redis.js       # Redis caching
│   ├── controllers/       # Request handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   └── Dockerfile         # Production build
├── scripts/
│   ├── setup.sh           # Development setup
│   └── healthcheck.py     # Health check utility
├── docker-compose.yml      # Container orchestration
└── .github/workflows/      # CI/CD
```

## Scripts

### Server

```bash
npm start      # Production server
npm run dev    # Development with hot-reload
npm run lint   # Run ESLint
```

### Client

```bash
npm start      # Development server
npm run build  # Production build
npm run lint   # Run ESLint
npm test       # Run tests
```

### Utilities

```bash
# Setup development environment
./scripts/setup.sh

# Health check with test paste
python scripts/healthcheck.py --create-test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Priyanshu Garg** - [GitHub](https://github.com/Priyans-hu)
