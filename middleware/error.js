import Errorhander from "../utils/errorHander.js";

export default function errorMiddleware(err,req,res,next){
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal server Error"

    //mongodb id error
    if(err.name=="CastError"){
        const message=`resourse not found invalid :${err.path}`
        err= new Errorhander(message,400)
    }
    //mogoose dupliate key error
    if(err.code===11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} Enterd`;
        err=new Errorhander(message,400)
    }
    //Wrong JWT Error
    if(err.name=="jsonWebTokenError"){
        const message=`jsonWebToken is invalid try again`
        err=new Errorhander(message,400)
    }
    //jst expir error
    if(err.name=="TookenExpiredError"){
        const message=`jsonWebToken is expired try again`
        err=new Errorhander(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message 
    })
}