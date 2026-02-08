import mongoose from "mongoose";

export const connectDB=async()=>{
    await mongoose.connect('mongodb+srv://vaniya1004_db_user:taskmanager123@cluster0.itlrhcx.mongodb.net/task_manager' || process.env.DB_URL).
    then(()=>console.log('DB Connected'));
}
