const jwt=require('jsonwebtoken')
function verify(req,res,next) {
    const authHeader= req.headers.token;
    if(authHeader){
        const token = authHeader
           jwt.verify(token,process.env.Secret_key,(err,user)=>{
            if (err) res.status(403).json("Token Invalid")
            req.user= user;
            next()
        })
    }else{
        return res.status(401).json("Your are not authenticated")
    }
}
module.exports= verify;