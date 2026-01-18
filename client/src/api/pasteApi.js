import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class PasteApi {
    constructor() {
        this.api = axios.create({
            baseURL: `${API_BASE_URL}/api/pastes`,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    createPaste({ content, language = 'plaintext', title = 'Untitled' }) {
        return this.api.post('/', { content, language, title });
    }

    getPasteById(pasteId) {
        return this.api.get(`/${pasteId}`);
    }

    deletePaste(pasteId) {
        return this.api.delete(`/${pasteId}`);
    }

    searchPastes(query) {
        return this.api.get('/search', { params: { q: query } });
    }
}

const pasteApi = new PasteApi();
export default pasteApi;