const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const userController = require('../controllers/userControllers');

router.get('/test', (req, res) => res.json({ ok: true }));
router.get('/me', auth(), userController.getProfile);
router.get('/search/agronomists', userController.searchAgronomists);
router.put('/me', auth(), userController.updateProfile);
router.get('/:id', userController.getUserById);




module.exports = router;
