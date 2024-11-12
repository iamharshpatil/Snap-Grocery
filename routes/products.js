const express=require("express");
const router=express.Router();
const passport=require('passport');
const {productModel,validateProduct}=require('../models/product');
const {categoryModel,validateCategory}=require("../models/category");
const upload=require('../config/multer-config');
const {validateAdmin,userIsLoggedIn}=require("../middlewares/admin");
const {cartModel,validateCart}=require("../models/cart")

router.get("/",userIsLoggedIn,async function(req,res)
{
  let somethingInCart=false;
  const resultArray = await productModel.aggregate([
    {
      $group: {
        _id: "$category",  // Group by the category field
        products: { $push: "$$ROOT" }  // Push all product details into an array
      }
    },
    {
      $project: {
        _id: 0,  // Exclude the _id field
        category: "$_id",  // Rename _id to category
        products: { $slice: ["$products", 10] }  // Limit to first 10 products per category
      }
    },
  ]);

let cart=await cartModel.findOne({user:req.session.passport.user});
if(cart && cart.products.length>0) somethingInCart=true;

let rnproducts=await productModel.aggregate([{$sample:{size:3}}]);

const resultObject=resultArray.reduce((acc,item) => 
{
acc[item.category]=item.products;
return acc;
},{});
     res.render("index",{products:resultObject,rnproducts,somethingInCart,cartCount: cart ? cart.products.length:0});
})

router.get("/delete/:id",validateAdmin,async function(req,res)
{
  if(req.user.admin)
  {
    let prods=await productModel.findOneAndDelete({_id:req.params.id}); 
    res.redirect("/admin/products");       
  }
    else
    {
      res.send("you do not have permissions to delete this product.")
    }     
})


router.post("/delete",validateAdmin,async function(req,res)
{
  if(req.user.admin)
  {
    let prods=await productModel.findOneAndDelete({_id:req.body.product_id}); 
    res.redirect("back");       
  }
    else
    {
      res.send("you do not have permissions to delete this product.")
    }     
})

router.post("/",upload.single("image"),async function(req,res)
{
     let {name,price,category,stock,description,image}=req.body;
 
   let {error}=validateProduct({
     name,
     price,
     category,
     stock,
     description,
     image
   })
 if(error) return  res.send(error.message);

 let isCategory=await categoryModel.findOne({name:category});


 if(!isCategory)
  {await categoryModel.create({name:category})};

 await productModel.create({
  name,
  price,
  category,
  stock,
  description,
  image:req.file.buffer
 })
 res.redirect('/admin/dashboard'); 
 
})



module.exports=router;