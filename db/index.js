import mongoose from "mongoose";

const dbConnection = async () => {
try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
        
    })
    console.log("DB Connected Succesfully")
} catch (error) {
    console.log("DB Error:" + error)
}
}


export default dbConnection