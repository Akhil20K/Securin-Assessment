import mongoose from "mongoose";

const dbConnect = () => {
    mongoose.connect(process.env.DB);
    mongoose.connection.on("connected", () => {
        console.log("Connected to Mongoose Database Successfully!");
    })
    mongoose.connection.on("disconnected", () => {
        console.log("Disconnected to Mongoose Database Successfully!");
    })
    mongoose.connection.on("error", (err) => {
        console.log("Error while connecting to Mongoose Database: " + err);
    })
}

export default dbConnect;