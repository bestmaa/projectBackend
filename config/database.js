import Mongoose from "mongoose";

function connectmongodb(){
    Mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("connect success");
    }).catch((err)=>{
        console.log(err);
    })
}

export default connectmongodb