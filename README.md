# Pastebox

Pastebox is a simple and efficient pastebin service that allows users to store and share text snippets easily. It supports syntax highlighting, expiration dates for pastes, and a user-friendly interface.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Syntax Highlighting**: Automatically detects and highlights code syntax.
- **Expiration Dates**: Auto delete after 1 week.
- **User-friendly Interface**: Easy to use and navigate.

## Demo

Check out the live demo: [Pastebox Demo](https://example.com)

## Installation

To run Pastebox locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/priyans-hu/pastebox.git
    cd pastebox
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following variables:
    ```
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    SECRET_KEY=your_secret_key
    ```

4. **Start the server**:
    ```bash
    npm start
    ```

5. **Visit**:
    Open your browser and go to `http://localhost:3000`.

## Usage

### Creating a Paste

1. Click on the "New Paste" button.
2. Enter your text in the editor.
3. Choose the syntax highlighting language.
4. Click "Create Paste".

### Viewing a Paste

1. Go to the URL of the paste (e.g., `http://localhost:3000/paste/:id`).
2. View the text with syntax highlighting.

## API

Pastebox provides a RESTful API for interacting with pastes.

### Endpoints

- **Create a Paste**: `POST /api/pastes`
- **Get a Paste**: `GET /api/pastes/:id`
- **Delete a Paste**: `DELETE /api/pastes/:id`

### Example

#### Create a Paste
```bash
curl -X POST http://localhost:3000/api/pastes \
    -H "Content-Type: application/json" \
    -d '{"content":"Your code here", "syntax":"javascript", "expiration":"1d"}'
```

#### Get a Paste
```bash
curl http://localhost:3000/api/pastes/:id
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Submit a pull request.

## License

Pastebox is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or feedback, please reach out to:

- **Priyanshu Garg**
- GitHub: [priyans-hu](https://github.com/priyans-hu)