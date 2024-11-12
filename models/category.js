const mongoose = require('mongoose');
const Joi = require('joi');

// Category Schema
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
}, { timestamps: true });

const categoryModel = mongoose.model("Category", categorySchema);

// JOI validation schema
const validateCategory = (categoryData) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
    });

    return schema.validate(categoryData);
};

module.exports = {
    categoryModel,
    validateCategory
};
