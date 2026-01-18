const mongoose = require('mongoose');

// Parse expiration string to milliseconds
// Supports: "1h" to "24h" for hours, "1d" to "7d" for days, "1w" for week
const parseExpiration = (expiresIn) => {
    if (!expiresIn || typeof expiresIn !== 'string') {
        return 7 * 24 * 60 * 60 * 1000; // Default: 1 week
    }

    const match = expiresIn.match(/^(\d+)(h|d|w)$/);
    if (!match) {
        return 7 * 24 * 60 * 60 * 1000; // Default: 1 week
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
    case 'h': // Hours (max 24)
        return Math.min(value, 24) * 60 * 60 * 1000;
    case 'd': // Days (max 7)
        return Math.min(value, 7) * 24 * 60 * 60 * 1000;
    case 'w': // Weeks (max 1)
        return 7 * 24 * 60 * 60 * 1000;
    default:
        return 7 * 24 * 60 * 60 * 1000;
    }
};

// Validate expiration string
const isValidExpiration = (expiresIn) => {
    if (!expiresIn || typeof expiresIn !== 'string') return false;
    const match = expiresIn.match(/^(\d+)(h|d|w)$/);
    if (!match) return false;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    if (unit === 'h') return value >= 1 && value <= 24;
    if (unit === 'd') return value >= 1 && value <= 7;
    if (unit === 'w') return value === 1;
    return false;
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
        default: '1w',
        validate: {
            validator: isValidExpiration,
            message: 'Invalid expiration format. Use 1-24h, 1-7d, or 1w'
        }
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
        const duration = parseExpiration(this.expiresIn);
        this.expiresAt = new Date(Date.now() + duration);
    }
    next();
});

// Static method to validate expiration
PasteSchema.statics.isValidExpiration = isValidExpiration;

const Paste = mongoose.model('Paste', PasteSchema);
module.exports = Paste;