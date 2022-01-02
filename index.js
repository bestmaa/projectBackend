import app from "./app.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import connectmongodb from "./config/database.js";
const PRODUCTMOOD="DEV"
process.on("uncaughtException", (err) => {
  console.log(`"Error: ${err.message}`);
  console.log(`Shut down server due to uncaughtExceptioon rejection`);
  process.exit(1);
});
if(PRODUCTMOOD=="DEV"){
  dotenv.config({ path: "./config/config.env" });

}
connectmongodb();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const server = app.listen(process.env.PORT, () => {
  console.log("Server Start" + " " + process.env.PORT);
});
//unhandled Promise Rejection
// process.on("unhandledRejection",err=>{
//     console.log(`Error ${err.message}`);
//     console.log(`Shut down server due to unhandled promise rejection`);
//     server.close(()=>{
//         process.exit(1)
//     })
// })
