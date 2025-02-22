import jwt from "jsonwebtoken";
const protectRoute = (...roles) => {
    return (req,res,next)=>{
    const token = req.cookies?.token; 

    if (!token) {
        console.log("No token found in cookies");  
        return res.status(401).json({ message: "Unauthorized - No Token" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        console.log("Decoded JWT:", decoded);  
        if(roles.length && !roles.includes(decoded.role)){
            return res.status(403).json({ message: "Forbidden - You do not have permission to access this resource" });
        }
        req.user = decoded.email;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    }
};
export default protectRoute;