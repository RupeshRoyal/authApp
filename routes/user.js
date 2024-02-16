const express = require('express')
const router = express.Router();
const User =  require("../models/User");

const { login, signup } = require("../controllers/auth");
const { auth, isAdmin, isStudent } = require("../middlewares/auth")

router.post("/signup", signup);
router.post("/login", login);

router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"Testing portal"
    });
});
//protected routes
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to student portal"
    });
});
router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"Welcome to admin portal"
    });
});

router.get("/getEmail",auth,(req,res)=>{
    try{    
        const id= req.user.id;
        const user = User.findById(id);

        res.status(200).json({
            success:true,
            message:"Welcome to email route"
        });
    }catch(error){

      res.status(500).json({
        success:false,
        message:"email route failed"
    });
}
});
module.exports = router;