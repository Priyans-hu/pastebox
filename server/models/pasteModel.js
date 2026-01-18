const mongoose = require('mongoose');

// Expiration options in milliseconds
const EXPIRATION_OPTIONS = {
    '1h': 60 * 60 * 1000,           // 1 hour
    '1d': 24 * 60 * 60 * 1000,      // 1 day
    '1w': 7 * 24 * 60 * 60 * 1000,  // 1 week
    '1m': 30 * 24 * 60 * 60 * 1000, // 1 month
    'never': null                    // No expiration
};

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
    expiresIn: {
        type: String,
        enum: ['1h', '1d', '1w', '1m', 'never'],
        default: '1w'
    },
    expiresAt: {
        type: Date,
        default: null,
        index: { expires: 0 } // TTL index - MongoDB auto-deletes when expiresAt is reached
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate expiresAt before saving
PasteSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('expiresIn')) {
        const duration = EXPIRATION_OPTIONS[this.expiresIn];
        if (duration === null) {
            this.expiresAt = null; // Never expires
        } else {
            this.expiresAt = new Date(Date.now() + duration);
        }
    }
    next();
});

// Static method to get expiration options
PasteSchema.statics.getExpirationOptions = function() {
    return Object.keys(EXPIRATION_OPTIONS);
};

const Paste = mongoose.model('Paste', PasteSchema);
module.exports = Paste;