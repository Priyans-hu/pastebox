import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

class PasteApi {
    pasteApi = axios.create({
        baseURL: `${API_BASE_URL}/api/paste`,
        withCredentials: true,
    });

    getAllPastes() {
        return this.pasteApi.get('/');
    }

    getUserPastes(userId) {
        return this.pasteApi.get(`/user/${userId}`);
    }

    createPaste(pasteData) {
        return this.pasteApi.post('/', pasteData);
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