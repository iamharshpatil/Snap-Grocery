const mongoose = require('mongoose');
const Joi = require('joi');

// Address Schema
const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    zip: {
        type: Number,
        required: true,
        minlength:10000,
        maxlength:999999,
    },
    city: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    address: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
    }
});

// User Schema
const userSchema = mongoose.Schema({
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
        minlength: 6,
    },
    phone: {
        type: Number,
       
        min: 1000000000, // Minimum length of 10 digits
        max: 9999999999, // Maximum length of 10 digits
    },
    addresses: [AddressSchema],
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

// JOI validation schema
const validateUser = (userData) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6),
        phone: Joi.number().integer().min(1000000000).max(9999999999),
        addresses: Joi.array().items(
            Joi.object({
                state: Joi.string().min(2).max(50).required(),
                zip: Joi.number().min(10000).max(999999).required(),
                city: Joi.string().min(2).max(50).required(),
                address: Joi.string().min(5).max(100).required(),
            })
        ).required()
    });

    return schema.validate(userData);
};

module.exports = {
    userModel,
    validateUser
};
