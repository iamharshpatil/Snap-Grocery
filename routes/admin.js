const express = require('express');
const router=express.Router();
const {adminModel}=require("../models/admin");
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const {validateAdmin,userIsLoggedIn} = require('../middlewares/admin');
const {productModel}=require("../models/product");
const {categoryModel}=require("../models/category");


if(typeof process.env.NODE_ENV !== undefined && process.env.NODE_ENV === "DEVELOPMENT")
{
 router.get("/create",async function(req,res)
{
   try{
    let salt=await bcrypt.genSalt(10);
   let hash=await bcrypt.hash("admin",salt);

   let user=new adminModel({
    name:"Parv",
    email:"parv@admin.com",
    password:hash,
    role:"admin"
   });

   await user.save();
   let token=jwt.sign({email:"parv@admin.com"},process.env.JWT_KEY);
   res.cookie("token",token);
   res.send("admin created");
   }
   catch(err){
    res.send(err.message);
   }
})
}

router.get("/login",function(req,res)
{
    res.render("admin_login");
})

router.post("/login",async function(req,res)
{
    let{email,password}=req.body;
    let admin=await adminModel.findOne({email});
    if(!admin) return res.send("this admin is not available ");
  let result= await bcrypt.compare(password,admin.password);
  if(result)
  {
    let token=jwt.sign({email:"parv@admin.com",admin:true},process.env.JWT_KEY);
   res.cookie("token",token);
   res.redirect("/admin/dashboard");   
  }
})

router.get("/dashboard",validateAdmin,async function(req,res)
{
    let prodcount=await productModel.countDocuments();
    let categcount=await categoryModel.countDocuments();
    res.render("admin_dashboard",{prodcount,categcount});
})

router.get("/products",validateAdmin,async function(req,res)
{ 
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

const resultObject=resultArray.reduce((acc,item) => 
{
    acc[item.category]=item.products;
    return acc;
},{});

 res.render("admin_products",{products:resultObject});
  
})

router.get("/logout",validateAdmin,function(req,res)
{
    res.cookie("token","");
    res.redirect("/admin/login  ");
})

module.exports=router;