// Agronomist Model
const mongoose = require('mongoose');

const AgronomistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    specialization: {
        type: String,
        required: true,
    },
    yearsOfExperience: {
        type: Number,
        required: true,
    },
    
    location: {
        type: String,
        required: true,
    },
    
    passwordHash: {
        type: String,
        required: true,
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    availabilityStatus: {
        type: Boolean,
        default: true,
    }
},

 { timestamps: true } 

);

const Agronomist = mongoose.model('Agronomist', AgronomistSchema);

module.exports = Agronomist;

