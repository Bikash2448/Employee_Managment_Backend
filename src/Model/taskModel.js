import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true,
        unique:true
    },
    tasks:[
        {
            title:{
                type:String,
                required:true,
                maxLength:40
            },
            description:{
                type:String,
                maxLength:100
            },
            assign:{
                type:String,
                required:true
            },
            category:{
                type:String,
                required:true
            },
            date:{
                type:Date,
                required:true
            },
            status:{
                type:String,
                enum: ['newTask', 'inProgress', 'completed','uncomplete'],
                default: 'newTask'
            }
        }
    ]
})

export const taskModel = mongoose.model('task', taskSchema)