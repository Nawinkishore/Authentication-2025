
    import conn from "../config/db.js";
    import generateRefreshToken from "../Middlewares/refreshToken.js";
    import bcrypt from "bcrypt";
    import transporter from "../config/nodemailer.js";
    export class authController{
        static async register(req,res){
        try {
            const email_regex = /\S+@\S+\.\S+/;
            let {name,email,password,role} = req.body;
            if(!name || !email || !password || !role){
                res.status(400).send({error:"All fields are required"});
                return;
            }
            if(!email_regex.test(email)){
                res.status(400).send({error:"Invalid email address"});
                return;
            }
            conn.query('SELECT * FROM user WHERE email = ?',[email],async(err,result)=>{
                if(err){
                    res.status(400).send({error:err.message});
                    return;
                }
                if(result.length){
                    res.status(400).send({error:"User already exists"});
                    return;
                }
                let salt = await bcrypt.genSalt(10);
                let hashedPassword = await bcrypt.hash(password,salt);
                let newObj = {name,email,password:hashedPassword,role};
                let user = {
                    name,email,role
                }
                conn.query('INSERT INTO user SET ?',newObj,async(err,result)=>{
                    if(err){
                        res.status(400).send({error:err.message});
                    }
                    else{
                        let mailOptions = {
                            from : process.env.SENDER_EMAIL,
                            to:email,
                            subject:"Welcome to our platform",
                            text:`Hello ${name}, welcome to our platform.`
                        }
                        await transporter.sendMail(mailOptions);
                        res.status(200).send({
                            message:"User registered successfully",
                            user,
                            refreshToken:generateRefreshToken(user,res)
                        });
                    }
                });
                
            });
        
            

        } catch (error) {
                res.status(500).send({error:error.message});
        }
        }
        static async login(req,res){
            try {
                let {email,password} = req.body;
                if(!email || !password){
                    res.status(400).send({error:"All fields are required"});
                    return;
                }
                conn.query('SELECT * FROM user WHERE email = ?',[email],async(err,result)=>{
                    if(err){
                        res.status(400).send({error:err.message});
                        return;
                    }
                    if(!result.length){
                        res.status(400).send({error:"User does not exist"});
                        return;
                    }
                    let user = result[0];
                    let isMatch = await bcrypt.compare(password,user.password);
                    if(!isMatch){
                        res.status(400).send({error:"Invalid credentials"});
                        return;
                    }
                    res.status(200).send({
                        message:"User logged in successfully",
                        user,
                        refreshToken:generateRefreshToken(user,res)
                    });
                });
            } catch (error) {
                res.status(500).send({error:error.message});
            }
        }
        

        static async logout(req, res) {
                    res.cookie("token", null,{
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                    });
                    res.status(200).send({ message: "User logged out successfully" });
                }
            

        static async sendVerifyOtp(req, res) {
            try {
                let email  = req.user;
        
                conn.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
                    if (err) {
                        console.error("SQL Error:", err.message);
                        res.status(400).send({ error: err.message });
                        return;
                    }
                    console.log("Query result:", result); // Debugging line
        
                    if (!result.length) {
                        res.status(400).send({ error: "User does not exist" });
                        return;
                    }
        
                    if (result[0].isVerified) {
                        res.status(400).send({ error: "User is already verified" });
                        return;
                    }
        
                    let otp = Math.floor(100000 + Math.random() * 900000);
                    conn.query('UPDATE user SET verifyOtp = ? WHERE email = ?', [otp, email]);
                    let mailOptions = {
                        from: process.env.SENDER_EMAIL,
                        to: email,
                        subject: "OTP for verification",
                        text: `Your OTP is ${otp}`
                    };
        
                    await transporter.sendMail(mailOptions);
                    res.status(200).send({ message: "OTP sent successfully", otp });
                });
            } catch (error) {
                console.error("Error in sendVerifyOtp:", error.message);
                res.status(500).send({ error: error.message });
            }
        }
        static async verifyOtp(req, res) {
            try {
                let email = req.user;
                let { otp } = req.body;
        
                conn.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
                    if (err) {
                        console.error("SQL Error:", err.message);
                        res.status(400).send({ error: err.message });
                        return;
                    }
        
                    if (!result.length) {
                        res.status(400).send({ error: "User does not exist" });
                        return;
                    }
        
                    if (result[0].isVerified) {
                        res.status(400).send({ error: "User is already verified" });
                        return;
                    }
        
                    let storedOtp = result[0].verifyOtp?.toString(); // Ensure OTP is a string
                    let receivedOtp = otp.toString(); // Convert received OTP to string
        
                    if (storedOtp !== receivedOtp) {
                        res.status(400).send({ error: "Invalid OTP" });
                        return;
                    }
        
                    // Optional: Check OTP expiry
                    if (Date.now() > result[0].veriftyOtpExpiredAt) {
                        res.status(400).send({ error: "OTP expired" });
                        return;
                    }
        
                    // Mark user as verified
                    conn.query('UPDATE user SET isVerified = ?, verifyOtp = NULL WHERE email = ?', [true, email], (err, updateResult) => {
                        if (err) {
                            res.status(400).send({ error: err.message });
                        } else {
                            res.status(200).send({ message: "User verified successfully" });
                        }
                    });
                });
            } catch (error) {
                console.error("Error in verifyOtp:", error.message);
                res.status(500).send({ error: error.message });
            }
        }
        
        static async changePassword(req,res){
            try {
                let {email,password,newPassword} = req.body;
                if(!email || !password || !newPassword){
                    res.status(400).send({error:"All fields are required"});
                    return;
                }
                conn.query('SELECT * FROM user WHERE email = ?',[email],async(err,result)=>{
                    if(err){
                        res.status(400).send({error:err.message});
                        return;
                    }
                    if(!result.length){
                        res.status(400).send({error:"User does not exist"});
                        return;
                    }
                    let user = result[0];
                    let isMatch = await bcrypt.compare(password,user.password);
                    if(!isMatch){
                        res.status(400).send({error:"Invalid credentials"});
                        return;
                    }
                    let salt = await bcrypt.genSalt(10);
                    let hashedPassword = await bcrypt.hash(newPassword,salt);
                    conn.query('UPDATE user SET password = ? WHERE email = ?',[hashedPassword,email],(err,result)=>{
                        if(err){
                            res.status(400).send({error:err.message});
                        }
                        else{
                            res.status(200).send({message:"Password changed successfully"});
                        }
                    });
                });
            } catch (error) {
                res.status(500).send({error:error.message});
            }
        }
        static async updateProfile(req,res){
            try {
                let {email,name} = req.body;
                if(!email || !name){
                    res.status(400).send({error:"All fields are required"});
                    return;
                }
                conn.query('SELECT * FROM user WHERE email = ?',[email],(err,result)=>{
                    if(err){
                        res.status(400).send({error:err.message});
                        return;
                    }
                    if(!result.length){
                        res.status(400).send({error:"User does not exist"});
                        return;
                    }
                    conn.query('UPDATE user SET name = ? WHERE email = ?',[name,email],(err,result)=>{
                        if(err){
                            res.status(400).send({error:err.message});
                        }
                        else{
                            res.status(200).send({message:"Profile updated successfully"});
                        }
                    });
                });
        }catch (error) {
            res.status(500).send({error:error.message});
        }}
    }