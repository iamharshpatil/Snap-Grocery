const mongoose = require('mongoose');
const Joi = require('joi');

// Cart Schema
const CartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    }
}, { timestamps: true });

const cartModel = mongoose.model("Cart", CartSchema);

// JOI validation schema
const validateCart = (cartData) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.string().required(),
        totalPrice: Joi.number().min(0).required(),
    });

    return schema.validate(cartData);
};

module.exports = {
    cartModel,
    validateCart
};
