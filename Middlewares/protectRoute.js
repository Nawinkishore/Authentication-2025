import jwt from "jsonwebtoken";
const protectRoute = (req, res, next) => {
    const token = req.cookies?.token; 

    if (!token) {
        console.log("No token found in cookies");  
        return res.status(401).json({ message: "Unauthorized - No Token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        console.log("Decoded JWT:", decoded);  
        req.user = decoded.email;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
};
export default protectRoute;