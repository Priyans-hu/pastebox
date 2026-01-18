const Paste = require('../models/pasteModel');
const { getCachedPaste, cachePaste, invalidatePaste } = require('../config/redis');

// Create a new paste
exports.createPaste = async (req, res) => {
    try {
        const { content, language = 'plaintext', title = 'Untitled' } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const paste = new Paste({
            content,
            language,
            title: title.trim() || 'Untitled'
        });
        await paste.save();
        res.status(201).json(paste);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a paste by ID (with caching)
exports.getPasteById = async (req, res) => {
    try {
        const { id } = req.params;

        // Try cache first
        const cached = await getCachedPaste(id);
        if (cached) {
            return res.json(cached);
        }

        // Fetch from database
        const paste = await Paste.findById(id);
        if (!paste) {
            return res.status(404).json({ message: 'Paste not found or has expired' });
        }

        const pasteData = {
            id: paste._id,
            title: paste.title,
            language: paste.language,
            content: paste.content,
            createdAt: paste.createdAt,
            expiresAt: paste.expiresAt
        };

        // Cache the result
        await cachePaste(id, pasteData);

        res.json(pasteData);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Invalid paste ID' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Delete a paste by ID
exports.deletePasteById = async (req, res) => {
    try {
        const { id } = req.params;
        const paste = await Paste.findByIdAndDelete(id);

        if (!paste) {
            return res.status(404).json({ message: 'Paste not found' });
        }

        // Invalidate cache
        await invalidatePaste(id);

        res.json({ message: 'Paste deleted successfully' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Invalid paste ID' });
        }
        res.status(500).json({ error: error.message });
    }
};

// Search for pastes
exports.searchPastes = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const pastes = await Paste.find({
            $or: [
                { content: new RegExp(q, 'i') },
                { title: new RegExp(q, 'i') }
            ]
        }).select('title language createdAt expiresAt').limit(20);
        res.json(pastes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
