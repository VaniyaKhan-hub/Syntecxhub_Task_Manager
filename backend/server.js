import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
import {connectDB} from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// dotenv.config();
const app=express();
const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();

app.use('/api/users',userRoutes);
app.use('/api/tasks',taskRoutes);
app.get('/',(req,res)=>{
    res.send('API is running....');
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});