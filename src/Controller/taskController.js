import { userModel } from "../Model/userModel.js";
import { taskModel } from "../Model/taskModel.js";
import mongoose from "mongoose";


export async function addTask(req, res) {
    try {
        const { userName, title, description, category, date, status } = req.body;

        // Find the user by userName
        const user = await userModel.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare the task
        const newTask = {
            title,
            description,
            assign: user.name, // Automatically assign to the same user
            category,
            date,
            status: status || 'pending'
        };

        // Check if the user's task document exists
        let taskDocument = await taskModel.findOne({ user: user._id });

        if (!taskDocument) {
            // Create a new task document
            taskDocument = new taskModel({
                user: user._id,
                tasks: [newTask]
            });
        } else {
            // Add the task to the existing document
            taskDocument.tasks.push(newTask);
        }

        // Save the task document
        await taskDocument.save();

        res.status(201).json({ message: "Task added successfully", taskDocument });
    } catch (e) {
        res.status(500).json({ message: "Error adding task", error: e.message });
    }
}


export async function getAllTasks(req, res) {
    try {
        const tasks = await taskModel.find();
        res.status(200).json(tasks);
    } catch (e) {
        res.status(500).json({ message: "Error fetching tasks", error: e.message });
    }
}


export async function getTaskById(req, res) {
    try {
        const { taskId } = req.params;
        const taskDocument = await taskModel.findById(taskId);
        // console.log(taskDocument)

        if (!taskDocument) {
            return res.status(404).json({ message: "Task not found" });
        }

        const task = taskDocument.tasks;
        res.status(200).json(task);
    } catch (e) {
        res.status(500).json({ message: "Error fetching task", error: e.message });
    }
}


export async function updateTask(req, res) {
    try {
        const { taskId } = req.params;
        const updates = req.body;

        const taskDocument = await taskModel.findOne({ "tasks._id": taskId });

        if (!taskDocument) {
            return res.status(404).json({ message: "Task not found" });
        }

        const task = taskDocument.tasks.id(taskId);
        Object.assign(task, updates);

        await taskDocument.save();
        res.status(200).json({ message: "Task updated successfully", task });
    } catch (e) {
        res.status(500).json({ message: "Error updating task", error: e.message });
    }
}

export async function deleteTask(req, res) {
    try {
        const { taskId } = req.params;

        const taskDocument = await taskModel.findOne({ "tasks._id": taskId });

        if (!taskDocument) {
            return res.status(404).json({ message: "Task not found" });
        }

        taskDocument.tasks.id(taskId).remove();
        await taskDocument.save();

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: "Error deleting task", error: e.message });
    }
}


export async function getAllTaskEmp(req,res){
    const { employeeId } = req.params;

  try {

    const user = await userModel.findById(employeeId); // Find user by employeeId
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    const taskCounts = await taskModel.aggregate([
      { $match: { user:new mongoose.Types.ObjectId(employeeId) } }, // Match tasks for the specific employee
      { $unwind: '$tasks' }, // Decompose the tasks array into individual tasks
      {
        $group: {
          _id: '$tasks.status', // Group by task status
          count: { $sum: 1 }, // Count tasks per status
        },
      },
    ]);

    // Transform the result into a key-value object
    const result = taskCounts.reduce(
      (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
      { newTask: 0, inProgress: 0, completed: 0, uncomplete: 0 } // Default values
    );
    result.userName = user.name;
    console.log(result)

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching task counts:', error);
    res.status(500).json({ error: 'Error fetching task counts' });
  }

}