const Paste = require('../models/pasteModel');
const { getCachedPaste, cachePaste, invalidatePaste } = require('../config/redis');

// Create a new paste
exports.createPaste = async (req, res) => {
    try {
        const { content, language = 'plaintext', title = 'Untitled', expiresIn = '1w' } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ error: 'Content is required' });
        }

        // Validate expiresIn
        const validOptions = Paste.getExpirationOptions();
        if (!validOptions.includes(expiresIn)) {
            return res.status(400).json({
                error: `Invalid expiresIn value. Valid options: ${validOptions.join(', ')}`
            });
        }

        const paste = new Paste({
            content,
            language,
            title: title.trim() || 'Untitled',
            expiresIn
        });
        await paste.save();
        res.status(201).json(paste);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a paste by ID (with caching and view tracking)
exports.getPasteById = async (req, res) => {
    try {
        const { id } = req.params;

        // Try cache first (for read, but still increment view in DB)
        const cached = await getCachedPaste(id);
        if (cached) {
            // Increment view count in background (non-blocking)
            Paste.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
            return res.json({ ...cached, views: (cached.views || 0) + 1 });
        }

        // Fetch from database and increment view count
        const paste = await Paste.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!paste) {
            return res.status(404).json({ message: 'Paste not found or has expired' });
        }

        const pasteData = {
            id: paste._id,
            title: paste.title,
            language: paste.language,
            content: paste.content,
            createdAt: paste.createdAt,
            expiresAt: paste.expiresAt,
            expiresIn: paste.expiresIn,
            views: paste.views
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
        }).select('title language createdAt expiresAt views').limit(20);
        res.json(pastes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get raw/plain text content of a paste
exports.getRawPaste = async (req, res) => {
    try {
        const { id } = req.params;

        const paste = await Paste.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!paste) {
            return res.status(404).type('text/plain').send('Paste not found or has expired');
        }

        // Return plain text content with appropriate headers
        res.set({
            'Content-Type': 'text/plain; charset=utf-8',
            'Content-Disposition': `inline; filename="${paste.title || 'paste'}.txt"`
        });
        res.send(paste.content);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).type('text/plain').send('Invalid paste ID');
        }
        res.status(500).type('text/plain').send('Server error');
    }
};

// Get paste analytics
exports.getPasteAnalytics = async (req, res) => {
    try {
        const { id } = req.params;

        const paste = await Paste.findById(id).select('title views createdAt expiresAt expiresIn');
        if (!paste) {
            return res.status(404).json({ message: 'Paste not found or has expired' });
        }

        res.json({
            id: paste._id,
            title: paste.title,
            views: paste.views,
            createdAt: paste.createdAt,
            expiresAt: paste.expiresAt,
            expiresIn: paste.expiresIn
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Invalid paste ID' });
        }
        res.status(500).json({ error: error.message });
    }
};
