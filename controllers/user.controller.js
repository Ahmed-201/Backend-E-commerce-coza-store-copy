import { User } from "../Models/user.model.js";
import bcrypt from "bcrypt";
import generateToken from "../Utils/generateToken.js";
import { Token } from "../Models/userToken.model.js";
import { sendEmail } from "../Utils/nodemailer.setup.js";
import { generateOtp } from "../Utils/generateOTP.js";
import { OTP } from "../Models/userOTP.model.js";
import { Role } from "../Models/usersRole.model.js";

const registerUser = async (req, res) => {
  const { email, name, password ,role} = req.body;
  console.log(email, name, password);

  if (!email || !password || !name || !role) {
    return res.json({ mesage: "all feilds are required", status: "400" }); // or res.status(200).send("OK")
  }

  try {
    const userExist = await User.findOne({ email }).exec();

    if (userExist) {
      return res.status(409).json({ message: "User already exists" });
    }
     const checkRole = await  Role.findOne({role})

    if(!checkRole){
        return res.status(404).json({message:"role is cumpulsory"})
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password: hashedPassword ,role:checkRole._id});
    const savedUser = await newUser.save();
    console.log("sucessfully registered user..");

    res.status(201).json({
      message: "successfully registerded",
      user: savedUser,
    });
  } catch (error) {
    console.log("error while user saving ...", error);
  }
};

const registerVendor=async(req,res)=>{

// return res.status(200).json({message:"yes working vendor register API"})
const { email, name, password ,address,role} = req.body;
  console.log(email, name, password,role,address);

  if (!email || !password || !name || !address || !role) {
    return res.json({ mesage: "all feilds are required", status: "400" }); // or res.status(200).send("OK")
  }

  try {
    const userExist = await User.findOne({ email }).exec();

    if (userExist) {
      return res.status(409).json({ message: "User already exists" });
    }

    const checkRole = await  Role.findOne({role})

    if(!checkRole){
        return res.status(404).json({message:"role is cumpulsory"})
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password: hashedPassword ,role:checkRole._id ,address});
    const savedUser = await newUser.save();
    console.log("sucessfully registered vendor..");

    res.status(201).json({
      message: "successfully registerded",
      user: savedUser,
    });
  } catch (error) {
    console.log("error while user saving ...", error);
  }


}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "all feilds are required",
    });
  }

  const userExist = await User.findOne({ email }).populate("role")
  .populate("role")
  .exec();

  if (!userExist) {
    return res.status(404).json({ message: "Invalid email or password" });
  }
  console.log(userExist, "userExist");

  const isPasswordMatched = await bcrypt.compare(password, userExist.password);

  if (!isPasswordMatched) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
console.log(userExist,"userExist.role.role")
  const token = generateToken(userExist._id, userExist.email , userExist.role.role );
  console.log(token, "token 107");

  const tokenDocument = new Token({
    userId: userExist._id,
    token: token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // expires in 1 day
  });

  await tokenDocument.save();

  res.status(201).json({
    message: "sucessfully login",
    token: token,
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  const emailExist = await User.findOne({ email }).exec();
  if (!emailExist) {
    return res.status(404).json({ message: "account not exist" });
  }

  const otp=generateOtp();

  // Save to DB
const otpEntry = new OTP({
  email,
  otp,
  expiresAt: Date.now() + 1 * 60 * 1000, // 1 minutes expiry
});

  const savingOtp= await otpEntry.save();
  // console.log(savingOtp,"savingOtp")

  // return res.status(200).json({message:"successfully saved otp in db"});

  if(savingOtp){

try {
    const response = await sendEmail({
      to: email,
      subject: "Testing Mail Service",
      text: `This is a plain text message: ${otp}`,
      html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

      res.status(200).json({ message: "successfully sent OTP please verify otp check mail " });
  } catch (error) {
    console.log("error sending mail", error);
  }
  }
  
};

const verifyOTP=async(req,res)=>{

  const{email,otp}=req.body
if(!email || !otp){

return res.status(400).json({message:"all feild required"})
}

const otpRecord= await OTP.findOne({email})

console.log(otpRecord,"recod OTP")
if (!otpRecord) {
  return res.status(404).json({ message: "record not found for this email" });
}

// Check if OTP matches
if (otpRecord.otp !== otp) {
  return res.status(400).json({ message: "Invalid OTP" });
}

// Check if OTP is expired
if (Date.now() > otpRecord.expiresAt) {
  await OTP.deleteOne({ _id: otpRecord._id }); // Clean up expired OTP
  return res.status(400).json({ message: "OTP has expired" });
}
// Success: OTP verified
await OTP.deleteOne({ _id: otpRecord._id }); // optional cleanup


  res.status(200).json({message:"verify otp please set your password now"})


}
const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, email } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successful now login with new Password" });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


export { registerUser,registerVendor ,loginUser, forgotPassword,verifyOTP,resetPassword };
                                                                                                       