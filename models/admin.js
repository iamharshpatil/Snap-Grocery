const mongoose = require('mongoose');
const Joi = require('joi');

// Admin Schema
const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'superadmin', 'moderator'], // Example roles
    }
}, { timestamps: true });

const adminModel = mongoose.model("Admin", AdminSchema);

// JOI validation schema
const validateAdmin = (adminData) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'superadmin', 'moderator').required(),
    });

    return schema.validate(adminData);
};

module.exports = {
    adminModel,
    validateAdmin
};
