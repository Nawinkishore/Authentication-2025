import jwt from "jsonwebtoken";
const generateRefreshToken = (user_id, res) => {
   
    const token = jwt.sign({user_id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

     

    res.cookie("token", token, {
        expires: new Date(Date.now() + 604800000), 
        httpOnly: true,
        secure: true,  
        sameSite: "strict",
    });

    return token; 
};

export default generateRefreshToken;
