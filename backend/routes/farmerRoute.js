// API Routes for Farmer operations
const express = require('express');
const router = express.Router();
const Farmer = require('../models/farmer');


// Create a new Farmer
router.post('/', async (req, res) => {
    try {
        const newFarmer = new Farmer(req.body);
        const savedFarmer = await newFarmer.save();
        res.status(201).json(savedFarmer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all Farmers
router.get('/', async (req, res) => {
    try {
        const farmers = await Farmer.find();
        res.status(200).json(farmers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get a Farmer by ID
router.get('/:id', async (req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }   
        res.status(200).json(farmer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
});
// Update a Farmer by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedFarmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFarmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }   
        res.status(200).json(updatedFarmer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }   
});
// Delete a Farmer by ID
router.delete('/:id', async (req, res) => {
    try {   
        const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);
        if (!deletedFarmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        res.status(200).json({ message: 'Farmer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
});

module.exports = router;