const User = require("../models/User");
 const bcrypt = require('bcrypt');
const jwt= require("jsonwebtoken");

require("dotenv").config();

exports.signup = async (req,res) => {
    try
    {
       //existinguser
       const{name,email,password,role}=req.body;

       const existingUser = await User.findOne({email});

       if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already registered",
        });
       }
       
       //hashing
       let hashedPassword;
       try{
        hashedPassword= await bcrypt.hash(password,10); 
       }
       catch(error){
        return res.status(500).json({
            success:false,
            message:"Password Hashing Failed",
        });
       }

       //create
       const user = await User.create({
        name,email,password:hashedPassword,role
       });

       return res.status(200).json({
        success:true,
        message:"user created",
       });

    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Unable to Signup" 
        })
    }
}


exports.login = async (req,res) => {
    try
    {
       const{email,password}=req.body;

       if(!email || !password){
            return res.status(400).json({
            success : false,
            message : "Enter email and password carefully" ,
            });
        }

        //check for registered user
        let user=await User.findOne({email});

        //if not a registered user
        if(!user){
            return res.status(401).json({
                success : false,
                message : "user is not registered please do signup" ,
                })
        }

        //verify password and create JWT Token

        const payload ={
            email:user.email,
            id:user._id,
            role:user.role,
        }
        if(await bcrypt.compare(password,user.password)){
            let token= jwt.sign(payload,`${process.env.SECRET_KEY}`,{ expiresIn:"2h"});

            user=user.toObject();
            user.token=token;
            user.password=undefined;

            const options ={
                expires: newDate= new Date(Date.now()+3*24*60*60*1000),//for 3 days in ms
                httpOnly:true,
            }
            //cookie=>name,value,options
            res.cookie("token",token,options).status(200).json({
                sucess:true,
                token,
                user,
                message:"Loged in successfully",
            });
        }
        else{//password doesnot match
            return res.status(403).json({
                success : false,
                message : "Password incorrect" 
            })
        }

    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Unable to Login" 
        })
    }
}