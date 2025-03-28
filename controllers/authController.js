
// import conn from "../config/db.js";
import generateRefreshToken from "../Middlewares/refreshToken.js";
import bcrypt from "bcrypt";
// import transporter from "../config/nodemailer.js";
import User from "../model/User.model.js";
// export class authController {
//     static async register(req, res) {
//         try {
//             const email_regex = /\S+@\S+\.\S+/;
//             let { name, email, password, role, isVerified } = req.body;
//             if (!name || !email || !password || !role) {
//                 res.status(400).send({ error: "All fields are required" });
//                 return;
//             }
//             // Password Regex
//             let password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
//             if (!password_regex.test(password)) {
//                 res.status(400).send({ error: "Password must contain at least one uppercase letter, one lowercase letter, one number and at least 6 characters" });
//                 return;
//             }

//             if (!email_regex.test(email)) {
//                 res.status(400).send({ error: "Invalid email address" });
//                 return;
//             }
//             if (isVerified == false) {
//                 return res.status(400).send({ error: "User is not verified" });
//             }
//             conn.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
//                 if (err) {
//                     res.status(400).send({ error: err.message });
//                     return;
//                 }
//                 if (result.length) {
//                     res.status(400).send({ error: "User already exists" });
//                     return;
//                 }
//                 let salt = await bcrypt.genSalt(10);
//                 let hashedPassword = await bcrypt.hash(password, salt);
//                 let newObj = { name, email, password: hashedPassword, role, isVerified };
//                 let user = {
//                     name, email, role
//                 }

//                 conn.query('INSERT INTO user SET ?', newObj, async (err, result) => {
//                     if (err) {
//                         res.status(400).send({ error: err.message });
//                     }
//                     else {
//                         let loginPage = `${process.env.BASE_URL}/api/auth/me`
//                         let mailOptions = {
//                             from: process.env.SENDER_EMAIL,
//                             to: email,
//                             subject: "Welcome to our platform",
//                             text: `Hello ${name}, welcome to our platform.`,
//                             html: `<a href="${loginPage}" style="text-decoration: none;">
//                                   <button style="background-color: blue; color: white; padding: 10px 20px; border: none; cursor: pointer;">
//                                     Click Here
//                                     </button>
//                                     </a>`
//                         }
//                         await transporter.sendMail(mailOptions);
//                         res.status(200).send({
//                             message: "User registered successfully",
//                             // user,
//                             refreshToken: generateRefreshToken(user, res)
//                         });
//                     }
//                 });

//             });



//         } catch (error) {
//             res.status(500).send({ error: error.message });
//         }
//     }
//     static async login(req, res) {
//         try {
//             let { email, password } = req.body;
//             if (!email || !password) {
//                 res.status(400).send({ error: "All fields are required" });
//                 return;
//             }
//             conn.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
//                 if (err) {
//                     res.status(400).send({ error: err.message });
//                     return;
//                 }
//                 if (!result.length) {
//                     res.status(400).send({ error: "User does not exist" });
//                     return;
//                 }
//                 let user = result[0];
//                 let isMatch = await bcrypt.compare(password, user.password);
//                 if (!isMatch) {
//                     res.status(400).send({ error: "Invalid credentials" });
//                     return;
//                 }
//                 res.status(200).send({
//                     message: "User logged in successfully",
//                     // user,
//                     refreshToken: generateRefreshToken(user, res)
//                 });
//             });
//         } catch (error) {
//             res.status(500).send({ error: error.message });
//         }
//     }
//     static async logout(req, res) {
//         res.cookie("token", null, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "strict",
//         });
//         res.status(200).send({ message: "User logged out successfully" });
//     }
//     static async getMe(req, res) {
//         try {
//             let email = req.user;
//             conn.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
//                 if (err) {
//                     res.status(400).send({ error: err.message });
//                 } else {
//                     let user = result[0];
//                     // To hide the Password
//                     delete user.password;
//                     // res.status(200).send({ user });
//                     res.send('Hello World!');
//                     //
//                 }
//             });
//         } catch (error) {
//             res.status(500).send({ error: error.message });
//         }
//     }
//     static async forgotPassword(req, res) {
//         let { email } = req.body;
//         if (!email) {
//             res.status(400).send({ error: "Email is required" });
//             return;
//         }
//         conn.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
//             // Forgot Password Logic Here
//         });
//     }
//     // static async sendVerifyOtp(req, res) {
//     //     try {
//     //         let email  = req.user;

//     //         conn.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
//     //             if (err) {
//     //                 console.error("SQL Error:", err.message);
//     //                 res.status(400).send({ error: err.message });
//     //                 return;
//     //             }


//     //             if (!result.length) {
//     //                 res.status(400).send({ error: "User does not exist" });
//     //                 return;
//     //             }

//     //             if (result[0].isVerified) {
//     //                 res.status(400).send({ error: "User is already verified" });
//     //                 return;
//     //             }

//     //             let otp = Math.floor(100000 + Math.random() * 900000);
//     //             let otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
//     //             .toISOString()
//     //             .slice(0,19)
//     //             .replace("T"," "); 
//     //             conn.query('UPDATE user SET verifyOtp = ? WHERE email = ?', [otp, email]);
//     //             conn.query('UPDATE user SET verifyOtpExpiredAt = ? WHERE email = ?', [otpExpiry, email]);
//     //             let mailOptions = {
//     //                 from: process.env.SENDER_EMAIL,
//     //                 to: email,
//     //                 subject: "OTP for verification",
//     //                 text: `Your OTP is ${otp}`
//     //             };

//     //             await transporter.sendMail(mailOptions);
//     //             res.status(200).send({ message: "OTP sent successfully", otp });
//     //         });
//     //     } catch (error) {
//     //         console.error("Error in sendVerifyOtp:", error.message);
//     //         res.status(500).send({ error: error.message });
//     //     }
//     // }
//     // static async verifyOtp(req, res) {
//     //     try {
//     //         let email = req.user;
//     //         let { otp } = req.body;

//     //         conn.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
//     //             if (err) {
//     //                 console.error("SQL Error:", err.message);
//     //                 res.status(400).send({ error: err.message });
//     //                 return;
//     //             }

//     //             if (!result.length) {
//     //                 res.status(400).send({ error: "User does not exist" });
//     //                 return;
//     //             }

//     //             if (result[0].isVerified) {
//     //                 res.status(400).send({ error: "User is already verified" });
//     //                 return;
//     //             }

//     //             let storedOtp = result[0].verifyOtp?.toString();
//     //             let receivedOtp = otp.toString(); 

//     //             if (storedOtp !== receivedOtp) {
//     //                 res.status(400).send({ error: "Invalid OTP" });
//     //                 return;
//     //             }


//     //             if (Date.now() > result[0].veriftyOtpExpiredAt) {
//     //                 res.status(400).send({ error: "OTP expired" });
//     //                 return;
//     //             }


//     //             conn.query('UPDATE user SET isVerified = ?, verifyOtp = NULL,verifyOtpExpiredAt = NULL WHERE email = ?', [true, email], (err, updateResult) => {
//     //                 if (err) {
//     //                     res.status(400).send({ error: err.message });
//     //                 } else {
//     //                     res.status(200).send({ message: "User verified successfully" });
//     //                 }
//     //             });
//     //         });
//     //     } catch (error) {
//     //         console.error("Error in verifyOtp:", error.message);
//     //         res.status(500).send({ error: error.message });
//     //     }
//     // }
//     static async changePassword(req, res) {
//         try {
//             let { newPassword } = req.body;
//             let email = req.user;
//             if (!newPassword) {
//                 res.status(400).send({ error: "Password is required" });
//                 return;
//             }
//             let password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
//             if (!password_regex.test(newPassword)) {
//                 res.status(400).send({ error: "Password must contain at least one uppercase letter, one lowercase letter, one number and at least 6 characters" });
//                 return;
//             }
//             // check the newpassword is same as old password
//             conn.query('SELECT * FROM user WHERE email = ?', [email], async (err, result) => {
//                 if (err) {
//                     res.status(400).send({ error: err.message });
//                     return;
//                 }
//                 let user = result[0];
//                 let isMatch = await bcrypt.compare(newPassword, user.password);
//                 if (isMatch) {
//                     res.status(400).send({ error: "New password cannot be same as old password" });
//                     return;
//                 }
//                 let salt = await bcrypt.genSalt(10);
//                 let hashedPassword = await bcrypt.hash(newPassword, salt);
//                 conn.query('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
//                     if (err) {
//                         res.status(400).send({ error: err.message });
//                     }
//                     else {
//                         res.status(200).send({ message: "Password changed successfully" });
//                     }
//                 });
//             });
//         } catch (error) {
//             res.status(500).send({ error: error.message });
//         }
//     }
//     static async updateProfile(req, res) {
//         try {
//             let { email, name } = req.body;
//             if (!email || !name) {
//                 res.status(400).send({ error: "All fields are required" });
//                 return;
//             }
//             conn.query('SELECT * FROM user WHERE email = ?', [email], (err, result) => {
//                 if (err) {
//                     res.status(400).send({ error: err.message });
//                     return;
//                 }
//                 if (!result.length) {
//                     res.status(400).send({ error: "User does not exist" });
//                     return;
//                 }
//                 conn.query('UPDATE user SET name = ? WHERE email = ?', [name, email], (err, result) => {
//                     if (err) {
//                         res.status(400).send({ error: err.message });
//                     }
//                     else {
//                         res.status(200).send({ message: "Profile updated successfully" });
//                     }
//                 });
//             });
//         } catch (error) {
//             res.status(500).send({ error: error.message });
//         }
//     }
// }

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name) { return res.status(400).send({ error: "Name is required" }) }
        if (!email) { return res.status(400).send({ error: "Email is required" }) }
        if (!password) { return res.status(400).send({ error: "Password is required" }) }
        if (email) {
            const existingUser = await User.find({ email });
            if (existingUser.length) {
                return res.status(400).send({ error: "User already exists" });
            }
        }
        const email_regex = /\S+@\S+\.\S+/;
        if (!email_regex.test(email)) {
            return res.status(400).send({ error: "Invalid email address" });
        }
        const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/;
        if(!password_regex.test(password)) {
            return res.status(400).send({ error: "Password must contain at least one uppercase letter, one lowercase letter, one number and at least 6 characters" });
        }
    
        let passwordSalt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, passwordSalt);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        let token =  generateRefreshToken(user.id , res);
        return res.status(200).send({ 
            token,
            success : true,
            message: "User registered successfully" });

    } catch (error) {
        return res.status(500).send({
            error: error.message,
            success: false
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) { return res.status(400).send({ error: "Email is required" }) }
        if (!password) { return res.status(400).send({ error: "Password is required" }) }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: "Invalid credentials" });
        }
        let token =  generateRefreshToken(user.id , res);
        return res.status(200).send({ 
            token,
            success : true,
            message: "User logged in successfully" });

    } catch (error) {
        return res.status(500).send({
            error: error.message,
            success: false
        });
    }
}

export const logout = async (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.status(200).send({ message: "User logged out successfully" });
}

export const getMe = async (req, res) => {
    try {
            let id = req.user;
            const user = await User.findById(id);
            if (!user) {
                return res.status(400).send({ error: "User does not exist" });
            }
            return res.status(200).send({ 
                user,
                success : true
            });
    }
    catch (error) {
        return res.status(500).send({
            error: error.message,
            success: false
        });
    }
}

