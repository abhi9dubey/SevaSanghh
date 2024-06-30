const mongoose=require("mongoose");

const {Schema,model}=mongoose;

const commentSchema=new Schema({
    issue:{type:Schema.Types.ObjectId,ref:'Issue'},
    content:{type:String},
    user:{type:Schema.Types.ObjectId,ref:'User'},
    created:{type:Date,default:Date.now()},
})

const commentModel=model("Comment",commentSchema);

module.exports=commentModel;