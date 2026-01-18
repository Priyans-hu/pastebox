const express = require('express');
const router = express.Router();
const pasteController = require('../controllers/pasteControllers');

// Search route must come before :id to avoid being caught by the param
router.get('/pastes/search', pasteController.searchPastes);

router.post('/pastes', pasteController.createPaste);
router.get('/pastes/:id', pasteController.getPasteById);
router.delete('/pastes/:id', pasteController.deletePasteById);

module.exports = router;