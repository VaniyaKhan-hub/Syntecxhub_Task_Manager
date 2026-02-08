import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const JWT_SECRET=process.env.JWT_SECRET || 'your_jwt_secret';
const TOKEN_EXPIRE_TIME='24h';

const createToken=(userId)=>jwt.sign({id:userId},JWT_SECRET,{expiresIn:TOKEN_EXPIRE_TIME});


//Register User
export const registerUser=async(req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email || !password){
        return res.status(400).json({success:false,message:'Please fill all the fields'});
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({success:false,message:'Invalid email'});
    }
    if(password.length<8){
        return res.status(400).json({success:false,message:'Password must be at least 8 characters'});
    }

    try{
        if(await User.findOne({email})){
            return res.status(400).json({success:false,message:'User already exists'});
        }
        const hashedpassword=await bcrypt.hash(password,10);
        const newUser=await User.create({
            name,
            email,
            password:hashedpassword
        });
        const token=createToken(newUser._id);
        res.status(201).json({success:true,token,message:'User created successfully',user:{id:newUser._id,name:newUser.name,email:newUser.email}});
    }
    catch(error){
        console.log(error)
        res.status(500).json({success:false,message:'Server error'});
    }
}

//Login User
export const loginUser=async(req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({success:false,message:'Emil and password are required'});
    }
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message:'Invalid credentials'});
        }
        const match=bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({success:false,message:'Invalid credentials'});
        }
        const token=createToken(user._id);
        res.status(200).json({success:true,token,message:'Login successful',user:{id:user._id,name:user.name,email:user.email}});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,message:'Server error'});
    }
}

//GET the user profile
export const getUserProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('name email');
        if(!user){
            return res.status(400).json({success:false,message:'User not found'});
        }
        res.status(200).json({success:true,user});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,message:'Server error'});
    }       
}

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email || !validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Valid name and email are required'
    });
  }

  try {
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user.id }
    });

    // ✅ FIX IS HERE
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: 'name email' }
    );

    res.json({ success: true, updatedUser });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


//Change user password
export const changeUserPassword=async(req,res)=>{
    const {currentPassword,newPassword}=req.body;
    if(!currentPassword || !newPassword || newPassword.length<8){
        return res.status(400).json({success:false,message:'Password invalid or too short'});
    }
    try{
        const user=await User.findById(req.user.id).select('password');
        if(!user){
            return res.status(404).json({success:false,message:'User not found'});
        }
        const match=await bcrypt.compare(currentPassword,user.password);
        if(!match){
            return res.status(401).json({success:false,message:'Current password is incorrect'});
        }
        user.password=await bcrypt.hash(newPassword,10);
        await user.save();
        res.json({success:true,message:'Password changed successfully'});
    }
    catch(error){
        console.log(error);
        res.status(500).json({success:false,message:'Server error'});
    }
}