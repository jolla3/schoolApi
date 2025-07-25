const jwt = require('jsonwebtoken')
const {User}= require('../models/schoolDb')
const bcyrpt= require('bcrypt')

// register logic
  
exports.registerAdmin= async(req,res)=>{
    const {name,email,password,secretKey}= req.body

    // verify admin secretkey
    if (!secretKey== process.env.secretKey){
        return res.status(403).json({message:"unauthorized Account Creation"})
    }

    // check if user exists
    const userExists= await User.findOne({email})
    if(userExists)
        return res.status(400).json({message:"Email already exists"})

    // hash password
    const hashedPassword= await bcyrpt.hash(password,10)
    const user= new User({
        name,
        email,
        password:hashedPassword,
        role:"admin",
        isActive:true,
        teacher:null,
        parent:null
    })
    const newUser=await user.save()
    res.status(201).json({message:`User ${newUser.role} ${name} Created Successfully  `, newUser})

    }
   
    // login
exports.login= async(req,res)=>{
    const {email,password}=req.body
    // console.log(email,password)
    const user= await User.findOne({email})

    // check the user by the email
    if(!user){
        return res.status(404).json({message:"invalid cridentials"})
    }

    // check if the user is active
    if(!user.isActive){
        return res.status(403).json({message:"Your acount has been deactivated" })
    }
    // check if the password is correct
    const isMatch= await bcyrpt.compare(password,user.password)
    if(!isMatch){
        return res.status(401).json({message:"invalid cridentials .."})
    }

    // generate a token
    const token= jwt.sign({
     userId:user._id,
     role:user.role,},
     process.env.JWt_SECRET,{
     expiresIn:"7d"}
    )
    res.json({message:"login succesfully",
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }

    })
}    