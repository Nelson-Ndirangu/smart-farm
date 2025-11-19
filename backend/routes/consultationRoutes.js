const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const consultationController = require('../controllers/consultationController');
const userController = require('../controllers/userController');

// create consultation request (farmer)
router.post('/', auth('farmer'), consultationController.createConsultationRequest);

// Get agronomists by ID
router.get('/search/agronomists', userController.searchAgronomists);

// Post consultaton details 
router.post("/", auth, async (req, res) => {
  try {
    const consultation = await Consultation.create({
      farmer: req.user.id,
      agronomist: req.body.agronomistId,
      topic: req.body.topic,
      description: req.body.description,
      price: req.body.price,
      status: "confirmed",
      scheduledAt: req.body.scheduledAt || null
    });

    res.status(201).json(consultation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create consultation" });
  }
});

// list consultations (farmer or agronomist)
router.get('/', auth(), consultationController.getConsultationsForUser);

// update status (both parties or admin)
router.patch('/:id', auth(), consultationController.updateConsultationStatus);

module.exports = router;
