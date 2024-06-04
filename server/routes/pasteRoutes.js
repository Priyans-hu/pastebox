const express = require('express');
const router = express.Router();
const pasteController = require('../controllers/pasteControllers');

router.post('/pastes', pasteController.createPaste);
router.get('/pastes/:id', pasteController.getPasteById);
router.delete('/pastes/:id', pasteController.deletePasteById);
router.get('/pastes/search', pasteController.searchPastes);

module.exports = router;