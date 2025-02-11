import express from 'express'
import { getUser,getuserByid,saveUser,updateUser,deleteUser,loginUser } from '../Controller/userController.js';



export const router = express.Router();

router.get('/',function(req,res){
    return res.json({message: 'Hello from user router'});
})
router.get('/users',getUser)
router.get('/users/:id',getuserByid);
router.post('/users',saveUser);
router.patch('/users/:id',updateUser);
router.delete('/users/:id',deleteUser);
router.post("/login", loginUser);
