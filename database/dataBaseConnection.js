import mongoose from "mongoose";

export  const dataBaseConnection =()=>{
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{
        // dbName:" MRSHEK97_HOSPITAL_PROJECT"
    }).then(()=>{
        console.log("connected to the database");
    }).catch((err)=>{
        console.log(`can't connected to the database ${err}`);
    })
}
