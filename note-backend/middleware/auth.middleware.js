import jwt from "jsonwebtoken"
// authentication for user
export const auth = async (req,res,next)=>{
    try{
        //  extract the token 
        // there are two ways to extract the token 
        let token ;
        if(req.body?.token){
            token = req.body.token
        }else if(req.cookies?.token){
            token = req.cookies.token
        }else if(req.headers?.authorization){
           token = req.headers.authorization.replace("Bearer ", "");
        }
        if(!token || token == "undefined"){
            return res.status(400).json({
                success:false,
                message:"Token is expired or undefined"
            })
        }
        try{
             const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
             req.user = decode
             console.log("user decoded value",req.user)
             next()
        }catch(error){
             return res.status(400).json({
                success:false,
                message:"token is not verified"
            })
        }
        

    }catch(error){
           return res.status(500).json({
            success:false,
            message:"Error while verifying token!",
            error:error.message
           })
    }
}
// isUser
export const isUser = async(req,res,next)=>{
    try{
        if(req.user.role !== "User"){
        return res.status(400).json({
            success:false,
            message:"This is Protected route for User"
        })
    }
    next()
    }catch(error){
       return res.status(500).json({
            success:false,
            message:"Error while verifying User Middleware!",
            error:error.message
           })
    }
    
} 
// isAdmin
export const isAdmin = async(req,res,next)=>{
   try{
        if(req.user.role !== "Admin"){
        return res.status(400).json({
            success:false,
            message:"This is Protected route for Admin"
        })
    }
    next()
    }catch(error){
       return res.status(500).json({
            success:false,
            message:"Error while verifying Admin Middleware!",
            error:error.message
           })
    }
} 