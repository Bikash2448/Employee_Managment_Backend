import { userModel } from "../Model/userModel.js";
// import jwt from "jsonwebtoken"
export const getUser = async (req,res) => {
    try{
        const user = await userModel.find();
        res.json(user);
    }
    catch(e){
        res.status(500).json({message:"Error in fetching user data"});
    }
}
export const getuserByid = async (req,res)=>{
    try{
        const user = await userModel.findById(req.params.id);
        res.json(user)
    }
    catch(e){
        console.log("fail in controller")
        res.status(400).json({message:e.message})
    }
}

export const saveUser = async (req,res)=>{

    const user = new userModel(req.body);
    

    try{
        const inserteuser = await user.save();
        res.status(201).json(inserteuser)
    }catch(e){
        res.status(400).json({message:e.message})
    }
}

export const updateUser = async (req,res)=>{
    try{
        const user = await userModel.updateOne({_id:req.params.id},{$set:req.body})
        res.status(200).json(user)
    }
    catch(e){
        res.status(400).json({message:e.message})
    }
}

export const deleteUser = async (req, res)=>{
    try{
        const user = await userModel.deleteOne({_id:req.params.id})
        res.status(200).json(user)
    }
    catch(e){
        res.status(400).json({message:e.message})
    }
}




// Auth controller
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login Attempt:", email);

        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Verify password
        const isMatch = await user.isPasswordCorrect(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Send response
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};