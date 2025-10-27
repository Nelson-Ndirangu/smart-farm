// API Routes for agronomist operations
const express = require('express');
const router = express.Router();
const Agronomist = require('../models/agronomist');

// Create a new Agronomist
router.post('/', async (req, res) => {
    try {
        const newAgronomist = new Agronomist(req.body);
        const savedAgronomist = await newAgronomist.save();
        res.status(201).json(savedAgronomist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Agronomists
router.get('/', async (req, res) => {
    try {
        const agronomists = await Agronomist.find();
        res.status(200).json(agronomists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get an Agronomist by ID
router.get('/:id', async (req, res) => {
    try {
        const agronomist = await Agronomist.findById(req.params.id);
        if (!agronomist) {
            return res.status(404).json({ message: 'Agronomist not found' });
        }   
        res.status(200).json(agronomist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
});
// Update an Agronomist by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedAgronomist = await Agronomist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAgronomist) {
            return res.status(404).json({ message: 'Agronomist not found' });
        }   
        res.status(200).json(updatedAgronomist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Delete an Agronomist by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedAgronomist = await Agronomist.findByIdAndDelete(req.params.id);
        if (!deletedAgronomist) {
            return res.status(404).json({ message: 'Agronomist not found' });
        }

        res.status(200).json({ message: 'Agronomist deleted successfully' });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
});

module.exports = router;