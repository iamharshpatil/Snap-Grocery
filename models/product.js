const mongoose = require('mongoose');
const Joi = require('joi');

// Product Schema
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    price: {
        type: String,
        required: true,
        match: /^\d+(\.\d{1,2})?$/, // Regular expression for price validation (e.g., 100.00 or 100)
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type:Number,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        type:Buffer,
    }
}, { timestamps: true });

const productModel = mongoose.model("Product", productSchema);

// JOI validation schema
const validateProduct = (productData) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        price: Joi.string().pattern(/^\d+(\.\d{1,2})?$/).required(),
        category: Joi.string().required(),
        stock: Joi.number().required(),
        description: Joi.string().min(10).max(1000),
        image: Joi.string().optional(),
    });

    return schema.validate(productData);
};

module.exports = {
    productModel,
    validateProduct
};
