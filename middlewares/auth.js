const jwt= require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req,res,next)=>{
    try{

        //extract token
        console.log("body",req.body.token);
        // console.log("cookie",req.cookie.token);
        // console.log("header",req.header("Authorization"));

        // const token= req.header("Authorization").replace("Bearer ","")||req.body.token || req.cookie.token;
        const token = req.body.token;

        if(!token){ 
           return res.status(401).json({
                success:false,
                message:"token missing"
            });
        }
        //verify
        try{
            const payload= jwt.verify(token,`${process.env.SECRET_KEY}`);
            console.log(payload);
             req.user=payload;
        }catch(error){
            console.error(error);
        return res.status(401).json({
            success : false,
            message : "Token is Invalid" 
        });
        }
        next();

    }catch(error){
        console.error(error);
        return res.status(401).json({
            success : false,
            message : "Something went wrong while verifying token" 
        });
    }
};


exports.isStudent= (req,res,next)=>{

    try{
        if(req.user.role!=="Student"){
            return res.status(401).json({
                success : false,
                message : "This is protected route for student" 
            });
        }
        next();
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "User role is not matching" 
        });
    }
    
};

exports.isAdmin= (req,res,next)=>{

    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success : false,
                message : "This is protected route for admin" 
            });
        }
        next();
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "User role is not matching" 
        });
    }
};