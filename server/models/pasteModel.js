const mongoose = require('mongoose');

const PasteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        default: function() {
            const oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
            return oneWeekFromNow;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Paste = mongoose.model('Paste', PasteSchema);
module.exports = Paste;