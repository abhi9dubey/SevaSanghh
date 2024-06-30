const Alert = require('../models/alerts');

const createAlert = async (req, res) => {
    try 
    {
        const data = req.body;
        data.user = req.user._id; // Add the user ID from the authenticated user
        
        const alert = new Alert(data);
        await alert.populate('user').execPopulate(); // Populate the user field
        await alert.save();

        res.status(201).json({ status: 'success', data: alert.toJSON() });
    } 
    catch (error) 
    {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAlert=async(req,res)=>{
    try{
        const alerts=await Alert.find();
    
        res.status(200).json({status:'Succes',data:alerts.toJSON()});
    }
    catch(error)
    {
        res.status(500).json({message:'Server Error'});
    }
}

module.exports = { createAlert,getAlert };
