const mongoose=require('mongoose')
const {Schema,model} = mongoose;

const UserSchema=new Schema({
    name:{type:String,required:true,min:4,max:255},
    password:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    is_staff:{type:Boolean,default:false},
    is_superuser:{type:Boolean,default:false},
    is_active:{type:Boolean,default:false},
    is_official:{type:Boolean,default:false},
}, { timestamps: true })

const UserModel=model("User",UserSchema);

module.exports=UserModel;