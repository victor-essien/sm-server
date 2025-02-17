import mongoose from "mongoose";
import { Schema } from "mongoose";

//schema
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First Name is Required"],
        },
        lastName: {
            type: String,
            required: [true, "Last Name is Required"],
        },
        email: {
            type: String,
            required: [true, "Email is Required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is Required"],
            minLength: [6, "Password must be at least 6 characters long"],
        },
       location: {type : String},
       profileUrl: {type: String},
       profession: {type: String},
       friends: [{type: Schema.Types.ObjectId, ref: "Users"}],
       chatRecipients: [
        {
          participant: {type: Schema.Types.ObjectId, ref: 'Users'},
          chatId:   {type: mongoose.Schema.Types.ObjectId, ref: 'Chat'} 

        }
    
    ],
       views: [{type: String}],
       verified: {type : Boolean, default: false},
    
},
    {timestamps: true}
);

const Users = mongoose.model("Users", userSchema);

export default Users;