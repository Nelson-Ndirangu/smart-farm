// Farmers models
const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    agronomist: 
                { 
                  type: mongoose.Schema.Types.ObjectId, ref: "Agronomist" 
                },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    farmSize: {
        type: Number,
        required: true,
    },
    cropDetails: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    subscriptionActive: {
        type: Boolean,
        default: false,
    },
    subcriptionExpiry:{
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

}, { timestamps: true });

const Farmer = mongoose.model('Farmer', FarmerSchema);
module.exports = Farmer;