const Issue=require("../models/issues");
const {uploadFile,getObjectSignedUrl}=require("../s3");
const crypto = require('crypto')

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const listIssues=async(req,res)=>{
    try{
        const issues=await Issue.find().populate('user');
        res.status(200).json(issues);
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
}

const getIssueDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id).populate('user');
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        res.status(200).json({ data: issue });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const createIssue=async(req,res)=>{
    try{
        const userId=req.user._id;

        let imageName = 'defaultImage.jpg';
        if (req.file!==undefined)
        {
            imageName=generateFileName()

            const fileVar = req.file;
            await uploadFile(fileVar?.buffer, imageName, fileVar.mimetype)
        }

        const issueData={...req.body,user:userId};
        issueData.image=await getObjectSignedUrl(imageName);

        // console.log("request body ",req.body);

        const issue=new Issue(issueData);
        issue.save();
        return res.status(201).json(issue);
        // console.log(100);
    }
    catch(error)
    {
        res.status(400).json({message:error.message})
    }
}

const getIssueDetails=async(req,res)=>{
    try{
        const issue=await Issue.findById(req.params.id).populate('user likes')
        if (!issue)
        return res.status(404).json({message:"Issue not found"})

        const likesCount=issue.getLikeCount();
        const userName=await issue.getUserName();
        const isLiked=issue.getIsLiked(req.user.id);
        const likedBy=await issue.getLikedBy();


        res.status(200).json({
            ...issue.toObject(),
            likesCount,
            userName,
            isLiked,
            likedBy
        })
    }
    catch(error)
    {
        res.status(500).json({message:error.message});
    }
}

const toggleIssueLike=async(req,res)=>{
    const userId=req.user.id;

    try{
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).send({ error: 'Issue not found' });

        const hasLiked = issue.likes.includes(userId);
        if (hasLiked) {
            issue.likes.pull(userId);
            await issue.save();
            return res.status(200).send({ success: 'like removed' });
        } else {
            issue.likes.push(userId);
            await issue.save();
            return res.status(200).send({ success: 'like added' });
        }
    }
    catch(error)
    {
        res.status(500).send({error:'Server Error'});
    }
}

const updateIssueStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { level } = req.body;

        const issue = await Issue.findById(id);
        if (!issue) return res.status(404).send({ error: 'Issue not found' });

        issue.status = level;
        await issue.save();

        res.status(200).send({ status: 'success', newLevel: issue.status });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred' });
    }
};

module.exports={listIssues,createIssue,getIssueDetails,toggleIssueLike,updateIssueStatus,getIssueDetail}