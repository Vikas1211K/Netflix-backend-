const router= require('express').Router();
const user= require('../models/User');
const crypto= require('crypto-js');
const verify= require('../veifyToken')

//Update
router.put('/:id',verify,async(req,res)=>{
    if(req.user.id=== req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password=crypto.AES.encrypt(req.body.password,process.env.Secret_key).toString()
        }
        try{
            const updatedUser= await user.findByIdAndUpdate(
                req.params.id,
                {$set:req.body},
                {new:true}
            )
            res.status(200).json(updatedUser)
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("This action is restricted")
    }
});

//Delete
router.delete('/:id',verify,async(req,res)=>{
    if(req.user.id=== req.params.id || req.user.isAdmin){
        try{
            const deletedUser= await user.findByIdAndDelete(req.params.id)
            res.status(200).json({  msg:"User has been deleted"})
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("This action is restricted")
    }
});

//get
router.get('/find/:id',async(req,res)=>{
    try{
        const User= await user.findById(req.params.id)
        const {password, ...info}= User._doc;
        res.status(200).json({info,msg:"User Found"})
    }catch(err){
        res.status(500).json(err)
    }
});

//get all user
router.get('/',verify,async(req,res)=>{
    const query  = req.query.new
    if(req.user.isAdmin){
        try{
            const User= query?await user.find().limit(10) : await user.find()
            res.status(200).json(User)
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(403).json("This action is restricted")
    }
});

//get user stats
router.get("/stats", async(req,res)=>{
    const today= new Date();
    const lastyear= today.setFullYear(today.setFullYear()-1);
    const monthsArray= ["January", "February"," March"," April"," May", "June", "July", "August", "September", "October"," November","December"]

    try{
        const data=await user.aggregate([
            {
                $project:{
                    month:{$month:"$createdAt"},
                },
            },
            {
                $group:{
                    _id:"$month",
                    total: {$sum:1}
                }
            }
        ]);
        res.status(200).json(data)
    }catch(err){
        res.status(500).json(err)
    }
})

module.exports= router