

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import dotenv from 'dotenv';

//  dotenv.config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required!"],
        minlength: [3, "First name must contain at least 3 characters!"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required!"],
        minlength: [3, "Last name must contain at least 3 characters!"]
    },
    email: {
        type: String, // Corrected from 'typer'
        required: [true, "Email is required!"],
        validate: [validator.isEmail, "Provide a valid email!"]
    },
    phone: {
        type: String, // Corrected from 'typer'
        required: [true, "Phone number is required!"],
        minlength: [11, "Phone number must contain exactly 11 digits!"],
        maxlength: [11, "Phone number must contain exactly 11 digits!"]
    },
    nic: {
        type: String, // Corrected from 'typer'
        required: [true, 'NIC is required!'],
        minlength: [13, "NIC must contain exactly 13 digits!"],
        maxlength: [13, "NIC must contain exactly 13 digits!"]
    },
    dob: {
        type: Date, // Corrected from 'typer'
        required: [true, "DOB is required!"]
    },
    gender: {
        type: String, // Corrected from 'typer'
        required: [true, "Gender is required!"],
        enum: ["Male", "Female"]
    },
    password: {
        type: String, // Corrected from 'typer'
        required: [true, "Password is required!"],
        minlength: [8, "Password must contain at least 8 characters!"],
        select: false
    },
    role: {
        type: String, // Corrected from 'typer'
        required: [true, "User role is required!"],
        enum: ["Patient", "Doctor", "Admin"]
    },
    doctorDepartment: {
        type: String // Corrected from 'typer'
    },
    docAvatar: {
        public_id: String,
        url: String
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    // console.log(process.env.PORT);

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

export const User = mongoose.model("User", userSchema);



