import express from 'express'
import mongoose from 'mongoose'
import { router } from './Router/userRouter.js'
import cors from 'cors'
import { taskrouter } from './Router/taskRouter.js'
import dotenv from 'dotenv'
// const dotenv = require('dotenv')
dotenv.config({path:'./.env'})
const app = express()

try{
    const mongoURI = process.env.MONGO_URI;
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log('Error connecting to Mongo:', err))
}catch(e){
    console.log("Error connecting to MongoDB",e)
}



const PORT = process.env.PORT || 3008;


app.use(cors())
app.use(express.json())

app.use(router)
app.use(taskrouter)

app.listen(PORT,()=>{
    console.log(`Server is running on port No ${PORT}`)
})