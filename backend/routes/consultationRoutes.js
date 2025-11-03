const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const consultationController = require('../controllers/consultationController');

// create consultation request (farmer)
router.post('/', auth('farmer'), consultationController.createConsultationRequest);

// mock payment endpoint to mark paid (dev)
router.post('/:consultationId/pay/mock', auth('farmer'), consultationController.handleMockPayment);

// list consultations (farmer or agronomist)
router.get('/', auth(), consultationController.getConsultationsForUser);

// update status (both parties or admin)
router.patch('/:id', auth(), consultationController.updateConsultationStatus);

module.exports = router;
