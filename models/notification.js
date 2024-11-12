const mongoose = require('mongoose');
const Joi = require('joi');

// Notification Schema
const notificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 500,
    },
    read: {
        type: String,
        required: true,
        enum: ['true', 'false'], // Represents if the notification is read or not
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

// JOI validation schema
const validateNotification = (notificationData) => {
    const schema = Joi.object({
        user: Joi.string().required(),
        message: Joi.string().min(1).max(500).required(),
        read: Joi.string().valid('true', 'false').required(),
    });

    return schema.validate(notificationData);
};

module.exports = {
    Notification,
    validateNotification
};
