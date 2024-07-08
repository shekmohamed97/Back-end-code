import {catchAsyncErrors} from "../middlewear/catchAsyncErrors.js"
import ErrorHandler from "../middlewear/errorMiddlewear.js"
import { User } from "../models/userShecma.js";
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary"

export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, phone, nic, email, gender, role, password, dob } = req.body;
  if (!firstName || !lastName || !phone || !nic || !email || !gender || !role || !password || !dob) {
    return next(new ErrorHandler("Please fill the full form", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already registered", 400));
  }

  user = await User.create({
    firstName,
    lastName,
    phone,
    nic,
    email,
    gender,
    role,
    password,
    dob
  });
  generateToken(user, "User registered!", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password,confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please provide all details!", 400));
  }

  if(password !== confirmPassword ){
    return next(
      new ErrorHandler("Password & confirmPassword do not match !",400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid password or email!", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password or email!", 400));
  }
  
  if (role !== user.role) {
    return next(new ErrorHandler("User with this role not found!", 400));
  }

  generateToken(user, "Login successful!", 201, res);
})

export const addNewAdmin=catchAsyncErrors(async(req,res,next)=>{
  const { firstName, lastName, phone, nic, email, gender, password, dob}  = req.body;
  if(
    !firstName ||
    !lastName ||
    !phone ||
    !nic ||
    !email ||
    !gender || 
    !password ||
    !dob  
  ){
    return next(new ErrorHandler("Please Fill Full Form!", 400));  
  }
  const isRegistered = await User.findOne({email});
  if(isRegistered){
    return next(new ErrorHandler("Admin with this email already exists !",400))
  }
  const admin = await User.create({
    firstName,
     lastName,
      phone,
       nic,
       email,
        gender,
        password,
         dob,
         role:"Admin"
  })
  res.status(200).json({
    success:true,
    message:"New Admin Rigistered"
  })
})


export const getAllDocters = catchAsyncErrors(async(req,res,nextt)=>{
  const docters =await User.find({role:"Docter"});
  res.status(200).json({
    success:true,
    docters
  });
});

export const getUserDetails= catchAsyncErrors(async(req,res,next)=>{
  const user = req.user;
  res.status(200).json({
    success:true,
    user,
  })
})

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for patient
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("patientToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Patient Logged Out Successfully.",
    });
});



export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Doctor Avatar Required!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler("Doctor With This Email Already Exists!", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
 
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "Doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});


