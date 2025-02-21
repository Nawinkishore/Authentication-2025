import jwt from "jsonwebtoken";
const generateRefreshToken = (user, res) => {
    const userPayload = {
        email: user.email,
        name: user.name,
        role: user.role
    };

    const token = jwt.sign(userPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

     

    res.cookie("token", token, {
        expires: new Date(Date.now() + 604800000), 
        httpOnly: true,
        secure: true,  
        sameSite: "strict",
    });

    return token; 
};

export default generateRefreshToken;
