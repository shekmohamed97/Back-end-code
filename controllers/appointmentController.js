import { catchAsyncErrors } from "../middlewear/catchAsyncErrors.js";
import ErrorHandler from "../middlewear/errorMiddlewear.js";
import { Appointment } from "../models/appointmentSchema.js";



export const postAppointment = catchAsyncErrors(async(req,res,next)=>{
    const{
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        address,
    }=req.body;
    if(
        !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date|| 
    !address
    ){
        return next(new ErrorHandler("Please Fill Full Form",400));
    }
        await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        address
    });
    res.status(200).json({
        success:true,
        message:"Appointment send !",
    });
});



export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
      success: true,
      appointments,
    });
  });


  export const updateAppointmentStatus = catchAsyncErrors(
    async (req, res, next) => {
      const { id } = req.params;
      let appointment = await Appointment.findById(id);
      if (!appointment) {
        return next(new ErrorHandler("Appointment not found!", 404));
      }
      appointment = await Appointment.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      res.status(200).json({
        success: true,
        message: "Appointment Status Updated!",
      });
    })

    export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
        const { id } = req.params;
        const appointment = await Appointment.findById(id);
        if (!appointment) {
          return next(new ErrorHandler("Appointment Not Found!", 404));
        }
        await appointment.deleteOne();
        res.status(200).json({
          success: true,
          message: "Appointment Deleted!",
        });
      });