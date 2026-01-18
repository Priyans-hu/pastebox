# Contributing to PasteBox

Thank you for your interest in contributing to PasteBox!

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in Issues
- Open a new issue with a clear title and description
- Include steps to reproduce the bug
- Add screenshots if applicable

### Suggesting Features

- Open an issue with the `enhancement` label
- Describe the feature and its use case
- Explain why it would be useful

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run tests: `npm test` (in /server)
5. Run lint: `npm run lint` (in both /client and /server)
6. Commit with a descriptive message
7. Push and open a Pull Request

### Code Style

- Use ESLint configuration provided
- Follow existing code patterns
- Add tests for new features
- Update documentation if needed

### Development Setup

```bash
# Clone the repo
git clone https://github.com/Priyans-hu/PasteBox.git
cd PasteBox

# Install dependencies
cd server && npm install
cd ../client && npm install

# Start development servers
# Terminal 1: Server
cd server && npm run dev

# Terminal 2: Client
cd client && npm start
```

## Code of Conduct

Be respectful and inclusive. We welcome contributions from everyone.

## Questions?

Open an issue or start a discussion.
