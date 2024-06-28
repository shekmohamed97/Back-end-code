class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const errorMiddleweare =(err,req,res,next)=>{
    err.message=err.message ||"Internal server error";
    err.statusCode=err.statusCode || 500;

    if(err.code===11000){
        const message = `Dublicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }
    if(err.name === "JdonWebTockenError"){
        const message =" Json Web Token Is Invalid , Try Again !";
        err= new ErrorHandler(message,400);
    }
    if(err.name === "TockenExpairedError"){
        const message = "Json Web Token Is Expaired , Try Again !";
        err= new ErrorHandler(message,400);
    }
    if(err.name === "CastError"){
        const message = `Invalid ${err.path}`;
        err =  new ErrorHandler (message,400);
    }    
    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}
export default ErrorHandler;