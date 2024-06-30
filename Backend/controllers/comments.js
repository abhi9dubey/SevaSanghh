const Issue=require("../models/issues");
const Comment=require("../models/comments");

const getComments=async(req,res)=>{
    try{
        const issue=await Issue.findById(req.params.id);
        if (!issue)
        {
            return res.status(400).json({error:'Invalid Issue Id'});
        }
        const comments=await Comment.find({issue:issue._id}).populate('user','name');
        res.status(200).json({data:comments});
    }
    catch(error)
    {
        res.status(500).json({error:'Server Error'});
    }
}

const createComment=async(req,res)=>{
    try
    {
        const issue=await Issue.findById(req.params.id);
        if (!issue)
        {
            return res.status(400).json({error: 'Invalid Issue Id'});
        }
        const data={
            content:req.body.content,
            issue:issue._id,
            user:req.user._id,
        }

        const comment=new Comment(data);
        await comment.save();
        res.status(201).json({status:'Success',data:comment});
    }
    catch(error)
    {
        res.status(500).json({error:'Server Error'});
    }
}

module.exports={getComments,createComment};