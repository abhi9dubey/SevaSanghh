const jwt=require("jsonwebtoken");
const User=require("../models/users");

const authenticateToken=(req,res,next)=>{
        const token=req.header('Authorization')?.split(' ')[1];
        // console.log(100);
        if(!token)
        {
            // console.log("100");
            return res.status(401).json({message:'Access denied. No token provided...'})
        }

        jwt.verify(token,process.env.JWT_SECRET,async(err,decoded)=>{
        if (err)
        {
            // console.log("Fuck",100);
            return res.status(401).json({ message: 'No token provided' });
        }

        try 
        {
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
        } 
        catch (error) 
        {
            // console.log(100);
            res.status(500).json({ message: 'Server error' });
        }
    })
}


// Middleware to check if user is an official
const isOfficial = async(req, res, next) => {
    try{
        const user=req.user;

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user && user.isOfficial) {
            return next();
        } else {
            return res.status(403).json({ message: 'Only officials can perform this action' });
        }
    }
    catch(error)
    {
        res.status(500).json({message:'Server Error'});
    }
};


module.exports={authenticateToken,isOfficial}