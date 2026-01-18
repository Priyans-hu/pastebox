# PasteBox

A simple and efficient pastebin service for sharing code snippets with syntax highlighting. Built with React and Node.js.

![PasteBox](https://img.shields.io/badge/PasteBox-Share%20Code-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)

## Features

- **Syntax Highlighting** - Support for 25+ programming languages
- **Auto-Expiration** - Pastes automatically delete after 7 days
- **Copy Functions** - One-click copy for code and shareable links
- **Live Preview** - See syntax highlighting as you type
- **Dark Theme** - Easy on the eyes with Dracula-inspired theme
- **Responsive** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TailwindCSS, React Syntax Highlighter
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with TTL indexes for auto-expiration

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Priyans-hu/PasteBox.git
   cd PasteBox
   ```

2. **Set up the server**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI
   npm install
   npm run dev
   ```

3. **Set up the client**
   ```bash
   cd client
   cp .env.example .env
   # Edit .env if using a different API URL
   npm install
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Environment Variables

**Server (`server/.env`)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pastebox
CLIENT_URL=http://localhost:3000
```

**Client (`client/.env`)**
```env
REACT_APP_API_URL=http://localhost:5000
```

## API Reference

### Create a Paste

```bash
POST /api/pastes

{
  "content": "console.log('Hello World');",
  "language": "javascript",
  "title": "My Snippet"
}
```

Response:
```json
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
```

### Delete a Paste

```bash
DELETE /api/pastes/:id
```

### Search Pastes

```bash
GET /api/pastes/search?q=query
```

## Supported Languages

JavaScript, TypeScript, Python, Java, C, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, SQL, HTML, CSS, SCSS, JSON, YAML, XML, Markdown, Bash, Shell, Dockerfile, and Plain Text.

## Project Structure

```
PasteBox/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── api/           # API client
│       ├── constants/     # Language definitions
│       └── pages/         # Home, PastedCode
├── server/                 # Express backend
│   ├── config/            # Database connection
│   ├── controllers/       # Request handlers
│   ├── models/            # Mongoose schemas
│   └── routes/            # API routes
└── README.md
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
