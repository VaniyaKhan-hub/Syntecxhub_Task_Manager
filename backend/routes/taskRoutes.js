import express from "express";
import authMiddleware from "../middleware/auth.js";

import {getTasks,createTask,getTaskById,updateTask,deleteTask} from "../controllers/taskController.js";
const taskrouter=express.Router();

taskrouter.route('/gp')
    .get(authMiddleware,getTasks)
    .post(authMiddleware,createTask);

taskrouter.route('/:id/gp')
    .get(authMiddleware,getTaskById)
    .put(authMiddleware,updateTask)
    .delete(authMiddleware,deleteTask);
export default taskrouter;