import express from "express";
import authMiddleware from "../middleware/auth.js";
import {registerUser,loginUser,getUserProfile,updateUserProfile,changeUserPassword} from "../controllers/usercontroller.js";

const router=express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);

router.get('/me',authMiddleware,getUserProfile);
router.put('/profile',authMiddleware,updateUserProfile);
router.put('/password',authMiddleware,changeUserPassword);

export default router;