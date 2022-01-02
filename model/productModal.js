import mongoose from "mongoose"

const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Plz Enter Poroduct Name"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Plz Enter Poroduct description"]
    },
    price:{
        type:Number,
        required:[true,"Plz Enter Poroduct price"],
        maxlength:[4,"Max Length is 4 "]
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:[true,"Plz Set IMage Public id"]
            },
            url:{
                type:String,
                required:[true,"Plz Set IMage url"]
            }
        }
    ],
    category:{
        type:String,
        required:[true,"Plz Enter Poroduct category"],
    },
    stock:{
        type:Number,
        default:1
    },
    numberOfReviws:{
        type:String,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true,
            },
            name:{
                type:String,
                required:[true,"Plz Enter Poroduct Number Of reviws Name"]
            },
            rating:{
                type:Number,
                required:[true,"Plz Enter Poroduct Number Of reviws rating"]
            },
            comment:{
                type:String,
                required:[true,"Plz Enter Poroduct Number Of reviws Comment"]
            },
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true,
    },
    // createAt:{
    //     type:Date,
    //     default:Date.now()
    // }
},{
    timestamps: true
})
const ProductModul=mongoose.model("products",ProductSchema)
export default ProductModul