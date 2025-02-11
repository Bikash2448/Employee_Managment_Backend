import express from 'express'
import { addTask,getAllTasks,getTaskById,updateTask,deleteTask,getAllTaskEmp } from '../Controller/taskController.js';


export const taskrouter = express.Router();





taskrouter.post('/tasks', addTask);
taskrouter.get('/tasks', getAllTasks);
taskrouter.get('/tasks/:taskId', getTaskById);
taskrouter.put('/tasks/:taskId', updateTask);
taskrouter.delete('/tasks/:taskId', deleteTask);
taskrouter.get('/tasks/emp/:employeeId',getAllTaskEmp);