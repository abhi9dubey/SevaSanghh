const mongoose=require("mongoose");
const {Schema,model}=mongoose;



const AlertSchema=new Schema({
    user:{type:Schema.Types.ObjectId,ref:'User'},
    title:{type:String,max:255},
    area:{type:String,max:255},
    desciption:{type:String},
    created:{type:Date,default:Date.now()},
    duration:{type:Number},
}, { timestamps: true })

const AlertModel=model("Alert",AlertSchema);

module.exports=AlertModel;