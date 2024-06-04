const Paste = require('../models/pasteModel');

// Create a new paste
exports.createPaste = async (req, res) => {
    try {
        const { content, language, expiration, isPrivate } = req.body;
        const paste = new Paste({ content, language, expiration, isPrivate });
        await paste.save();
        res.status(201).json(paste);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a paste by ID
exports.getPasteById = async (req, res) => {
    try {
        const paste = await Paste.findById(req.params.id);
        if (!paste) {
            return res.status(404).json({ message: 'Paste not found' });
        }
        // Extracting lang and content properties
        const { language, content } = paste;
        res.json({ language, content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a paste by ID
exports.deletePasteById = async (req, res) => {
    try {
        const paste = await Paste.findByIdAndDelete(req.params.id);
        if (!paste) {
            return res.status(404).json({ message: 'Paste not found' });
        }
        res.json({ message: 'Paste deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search for pastes
exports.searchPastes = async (req, res) => {
    try {
        const { q } = req.query;
        const pastes = await Paste.find({ content: new RegExp(q, 'i') });
        res.json(pastes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
