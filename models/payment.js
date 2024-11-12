const mongoose = require('mongoose');
const Joi = require('joi');

// Payment Schema
const PaymentSchema = mongoose.Schema({
 orderId:{
    type:String,
    required:true
 },
 paymentId:{
    type:String
 },
 signature:{
    type:String
 },
 amount:{
    type:Number,
    required:true,
 },
 currency:{
    type:String,
    required:true
 },
 status:{
    type:String,
    default:'pending'
 }
}, { timestamps: true });

const paymentModel = mongoose.model("Payment", PaymentSchema);

// JOI validation schema

module.exports = {
    paymentModel,
  
};
