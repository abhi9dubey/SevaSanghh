const mongoose=require("mongoose")
const {Schema,model}=mongoose;

const CATEGORY_CHOICES = ['water', 'infra', 'electrical', 'social_justice', 'other'];
const STATUS_CHOICES = [1, 2, 3, 4];


const IssueSchema=new Schema({
    title:{type:String,
      required:true,
      max:255
    },

    description:{
      type:String,
      required:false
    },

    user:{
      type:Schema.Types.ObjectId,
      ref:'User'
    },

    created:{
      type:Date,
      default:Date.now()
    },

    image:{
      type:String
    },

    category: {
      type: String,
      enum: CATEGORY_CHOICES,
      default: 'infra'
    },

    long:{
    type:mongoose.Types.Decimal128,
    max_digits:19,
    decimal_places:16
    },

    lat:{
      type:mongoose.Types.Decimal128,
      max_digits:19,
      decimal_places:16
    },

    likes:[{type:Schema.Types.ObjectId,ref:'User'}],

    status: {
    type: Number,
    enum: STATUS_CHOICES,
    default: 1,
  }
}, { timestamps: true })

IssueSchema.methods.getLikedCount=function(){
    return this.likes.length;
};
IssueSchema.methods.getUserName = async function() {
  const user = await this.populate('user').execPopulate();
  return user.name;
};

IssueSchema.methods.getIsLiked = function(userId) {
  return this.likes.some(like => like.equals(userId));
};

IssueSchema.methods.getLikedBy = async function() {
  const populatedIssue = await this.populate('likes').execPopulate();
  return populatedIssue.likes.map(user => user.name);
};


const IssueModel=model("Issue",IssueSchema);

module.exports=IssueModel;