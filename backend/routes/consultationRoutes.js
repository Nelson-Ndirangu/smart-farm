const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const consultationController = require('../controllers/consultationController');
const userController = require('../controllers/userController');

// create consultation request (farmer)
router.post('/', auth('farmer'), consultationController.createConsultationRequest);

// Get agronomists by ID
router.get('/search/agronomists', userController.searchAgronomists);

// list consultations (farmer or agronomist)
router.get('/', auth(), consultationController.getConsultationsForUser);

// update status (both parties or admin)
router.patch('/:id', auth(), consultationController.updateConsultationStatus);

module.exports = router;
