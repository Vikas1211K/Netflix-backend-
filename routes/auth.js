const router= require('express').Router();
const user= require('../models/User');
const crypto= require('crypto-js')
const jwt= require('jsonwebtoken')

//Register
router.post('/reg', async (req,res)=>{
    const findUser= await user.findOne({username:req.body.username})
    if(!findUser){
        const newUser=await user.create({
        username:req.body.username,
        password:crypto.AES.encrypt(req.body.password,process.env.Secret_key).toString(),
        email:req.body.email
        });
        try{
            const User= await newUser.save()
            res.status(200).json(User);
        }catch(err){res.status(500).json(err)}
    }
    else{
        res.status(200).json({'Msg':'User already exist😁!!.. Login please🙏'})
    }
})

router.post('/login',async(req,res)=>{
    const findUser= await user.findOne({ email: req.body.email });
    if (!findUser) {
        return res.status(400).json({error: "Please enter correct credentials" })
    }
    
    // const byte=crypto.AES.decrypt(findUser.password, process.env.Secret_key)
    // const originalPass=byte.toString(crypto.enc.Utf8)
    const originalPass=crypto.AES.decrypt(findUser.password, process.env.Secret_key).toString(crypto.enc.Utf8);
    if (originalPass !== req.body.password) {
        return res.status(400).json({error: "Please enter correct credentials" })
    }
    const accessToken=jwt.sign(
        {id:findUser._id, isAdmin:findUser.isAdmin},
        process.env.Secret_key,
        {expiresIn:'5d'}
    )
    const{password, ...info}=findUser._doc;
    res.status(200).json({...info, accessToken});
})

module.exports=router