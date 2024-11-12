const mongoose = require('mongoose');
const Joi = require('joi');

// Product Schema
const productSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    deliveryBoy: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'], // Example statuses
    },
    trackingUrl: {
        type: String,
        required: true,
        match: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, // Basic URL validation
    },
    estimateDeliveryTime: {
        type: Number,
        required: true,
        min: 0, // Time in minutes or hours
    }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

// JOI validation schema
const validateProduct = (productData) => {
    const schema = Joi.object({
        order: Joi.string().required(),
        deliveryBoy: Joi.string().min(2).max(50).required(),
        status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').required(),
        trackingUrl: Joi.string().uri(),
        estimateDeliveryTime: Joi.number().min(0).required(),
    });

    return schema.validate(productData);
};

module.exports = {
    Product,
    validateProduct
};
