import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:[3,"First name must contain at least 3 charecters !"]
    },
    lastName:{
        type:String,
        required:true,
        minlength:[3,"Last name must contain at least 3 charecters !"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Provide a valid email !"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
        maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
      },
      message: {
        type: String,
        required: true,
        minLength: [10, "Message Must Contain At Least 10 Characters!"],
      },
})

export const Message = mongoose.model("Message", messageSchema);