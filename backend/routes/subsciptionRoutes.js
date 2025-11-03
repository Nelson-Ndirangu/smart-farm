const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const subscriptionController = require('../controllers/subscriptionController');

router.post('/', auth('farmer'), subscriptionController.createSubscription);
router.get('/', auth('farmer'), subscriptionController.getSubscriptions);

module.exports = router;
