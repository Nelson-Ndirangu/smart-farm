const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const userController = require('../controllers/userControllers');

router.get('/me', auth(), userController.getProfile);
router.put('/me', auth(), userController.updateProfile);
router.get('/search/agronomists', auth(), userController.searchAgronomists);
router.post('/withdraw', auth(['agronomist']), userController.withdraw);

module.exports = router;
