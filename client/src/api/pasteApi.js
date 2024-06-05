import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_BASE_URL;
const API_BASE_URL = "http://localhost:5000";

class PasteApi {
    pasteApi = axios.create({
        baseURL: `${API_BASE_URL}/api/pastes/`,
        withCredentials: true,
    });

    getAllPastes() {
        return this.pasteApi.get('/');
    }

    getUserPastes(userId) {
        return this.pasteApi.get(`/user/${userId}`);
    }

    createPaste(code) {
        return this.pasteApi.post('/', { code });
    }

    getPasteById(pasteId) {
        return this.pasteApi.get(`/${pasteId}`);
    }

    updatePaste(pasteId, updatedData) {
        return this.pasteApi.put(`/${pasteId}`, updatedData);
    }

    deletePaste(pasteId) {
        return this.pasteApi.delete(`/${pasteId}`);
    }
}

const PasteApiInstance = new PasteApi();
export default PasteApiInstance;