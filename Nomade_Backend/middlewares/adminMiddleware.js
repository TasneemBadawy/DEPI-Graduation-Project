
const adminMiddleware = (req , res , next) =>{
     
    if(req.user.role !== "Admin" &&  req.user.role !== "Guide"){
         return res.status(403).json({
            message : "Access Denied"
         });
    }

    next();
};

export default adminMiddleware;