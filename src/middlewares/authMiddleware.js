const User = require('../models/user');
const JWT = require('jsonwebtoken')

exports.protect =async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1];
            const decode = JWT.verify(token, process.env.JWT_SECRET);
            req.user =await User.findById(decode.id).select('-password');
            // console.log(req.user.id);
            // console.log(req.user.email);
            next();
        }catch(err){
            return res.status(401).json({error:`Error autherization ${err}`})
        }
    }
    if(!token){
        return res.status(401).json({error:'Not authorized, no token' })
    }
};