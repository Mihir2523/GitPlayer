import mongoose from "mongoose";
export const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB");
    }catch(e){
        console.log(e);
        process.exit(1);
    }
}