const mongoose = require('mongoose');
const Joi = require('joi');

// Order Schema
const OrderSchema = mongoose.Schema({

    orderId:{
type:String,
required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    address: {
        type: String,
        minlength: 5,
        maxlength: 200,
    },
    
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], // Example statuses
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
       
    }
}, { timestamps: true });

const orderModel = mongoose.model("Order", OrderSchema);

// JOI validation schema
const validateOrder = (orderData) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string().required()).required(),
        totalPrice: Joi.number().min(0).required(),
        address: Joi.string().min(5).max(200),
        status: Joi.string().valid('pending', 'processed', 'shipped', 'delivered', 'cancelled').required(),
        payment: Joi.string().required(),
        delivery: Joi.string(),
    });

    return schema.validate(orderData);
};

module.exports = {
    orderModel,
    validateOrder
};
