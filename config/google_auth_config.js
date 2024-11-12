var GoogleStrategy = require('passport-google-oauth20').Strategy;
const {userModel}=require("../models/user");
const passport=require("passport");

passport.use(new GoogleStrategy({ 
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ['profile', 'email']  
  },
 async function(accessToken, refreshToken, profile, cb) {
    try{
        let user= await userModel.findOne({email:profile.emails[0].value});
        if(!user)
        {
         user= new userModel({
            name:profile.displayName,
            email:profile.emails[0].value 
         }) ;
         await user.save();  
        }
        cb(null,user)
       }
       catch(err){
        cb(err,false);
        
       }
  }
));

passport.serializeUser(function(user,cb)
{
    return cb(null,user._id)// by serialze we could add data to session 
})


passport.deserializeUser(async function(id, cb) {
   try {
     let user = await userModel.findOne({ _id: id });
     cb(null, user); // Pass the user object to the callback
   } catch (err) {
     cb(err, null);
   }
 });



module.exports=passport;