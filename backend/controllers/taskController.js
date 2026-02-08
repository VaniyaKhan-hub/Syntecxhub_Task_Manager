import Task from "../models/taskModel.js";

// Create a new task
export const createTask = async (req, res) => {
    try{
        const {title,description,priority,dueDate,completed}=req.body;
        const task=new Task({
            title,
            description,
            priority,
            dueDate,
            completed:completed === 'Yes' || completed === true,
            owner:req.user.id
        });
        const saved=await task.save();
        res.status(201).json({ message: 'Task created successfully', task: saved ,success:true});
    }
    catch (error) {
        res.status(400).json({ message:error.message,success:false });
    }
}

// Get All Task of Logged in User
export const getTasks = async (req, res) => {
try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ tasks, success: true });
} catch (error) {
    res.status(500).json({ message: error.message, success: false });
}
}


//get a Single Task By ID
export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        res.status(200).json({ task, success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }   
}

// Update a Task
export const updateTask = async (req, res) => {
    try {
        const data={...req.body};
        if(data.completed!== undefined){
            data.completed=data.completed === 'Yes' || data.completed === true;
        }
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id },
            data,
            { new: true,runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        res.status(200).json({ message: 'Task updated successfully', task: updatedTask, success: true });
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
}

// Delete a Task
export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        res.status(200).json({ message: 'Task deleted successfully', success: true });
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
}