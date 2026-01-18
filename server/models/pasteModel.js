const mongoose = require('mongoose');

const PasteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled'
    },
    content: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'plaintext'
    },
    expiresAt: {
        type: Date,
        default: function() {
            const oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
            return oneWeekFromNow;
        },
        index: { expires: 0 } // TTL index - MongoDB auto-deletes when expiresAt is reached
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Paste = mongoose.model('Paste', PasteSchema);
module.exports = Paste;