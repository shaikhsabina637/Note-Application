import User from "../models/user.models.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { sendEmail } from "../utils/nodemailer/nodemailer.js"
import Otp from "../models/otp.models.js"
import Contact from "../models/contact.models.js"
import Note from "../models/note.models.js"
import Feedback from "../models/feedback.models.js"
import {v2 as cloudinary} from "cloudinary"
import { cloudinaryConnect } from "../utils/cloudinary/cloudinary.js"
dotenv.config()
// signup controller 
const adminPassword = "Admin9321@"
export const signup =async (req,res)=>{
    try{
        // get data from user body
    const {firstName,lastName,email,password,confirmPassword} = req.body;
    // validate the data
    if(!firstName || !lastName || !email || !password || !confirmPassword ){
        return res.status(400).json({
            success:false,
            message:"All fields are mandatory!"
        })
    }
    // check if user already exit in db
    const existingUser = await User.findOne({
        $or:[
            {email}
        ]
    })
    if(existingUser){
       return res.status(409).json({
        success:false,
        message:"User already exit!"
       })
    }
    // check password and confirm password same or not
    if(password != confirmPassword){
        return res.status(401).json({
            success:false,
            message:"Please enter the correct password"
        })
    }
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

if(!passwordRegex.test(password)){
    return res.status(400).json({
        success: false,
        message: "Password must contain uppercase, lowercase, number, and special character",
    });
}
    // check the admin password
    let setRole= "User"
    if(password === adminPassword){
        setRole = "Admin"
    } 
    // hash the password 
    let hashedPassword ;
    try{
     hashedPassword = await bcrypt.hash(password,10)
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while hashing the password!",
            error:error.message
        })
    }
    
    // save the data in db
    const user = await User.create({
        firstName,
        lastName,
        email,
        password : hashedPassword,
        role : setRole,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
    })
    // return the response
    return res.status(201).json({
        success:true,
        user,
        message:"User created successfully!"
    })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error while creating user!",
            error:error.message
        })
    }
   
}
// login controller
export const login = async (req,res)=>{
    try{
    // extract the data from the user
    const {email,password} = req.body
    // validate the fields 
    if(!email || !password) {
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    // check if user exits in db or not
    const checkUserExist = await User.findOne({email})
    // if not exit return response with error message
    if(!checkUserExist){
        return res.status(400).json({
            success:false,
            message:"dont have account with this email!"
        })
    }
    // if exit check db password and user current password
   const matchingPassword = await bcrypt.compare(password, checkUserExist.password);
if (!matchingPassword) {
    return res.status(400).json({
        success: false,
        message: "The password is incorrect!"
    });
}

    // if password match generate jwt token 
    const payload ={
        id: checkUserExist._id,
        email:checkUserExist.email,
        role:checkUserExist.role
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{
        expiresIn: "6h"
    })
    // return the response 
      return res.status(200)
      .cookie("token",token,{
        httpOnly:true,
        // cookies send only http if i wnat https then i will chnage it to true 
        secure:true,
        sameSite: "none",
        // 32,000 mili seconds means 6h
        maxAge: 6 * 60 * 60 * 1000
      })
      .json({
        success:true,
        token,
        checkUserExist,
        message:"User logged in!"
      })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error while logged in!",
            error:error.message
        })
    }
}
// change password controller
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // validate required fields
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match!",
      });
    }

    // get user from DB
    const userId = req.user.id || req.user._id;
    const getUser = await User.findById(userId);
    if (!getUser) {
      return res.status(400).json({
        success: false,
        message: "Can't find User with this id!",
      });
    }

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, getUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect!",
      });
    }

    // prevent same password reuse (optional)
    if (await bcrypt.compare(newPassword, getUser.password)) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as old password!",
      });
    }

    // hash and save new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    getUser.password = hashedNewPassword;
    await getUser.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while changing the password!",
      error: error.message,
    });
  }
};

// forget password controller
export const forgetPassword = async(req,res)=>{
    try{
    //  get the user data 
    const {email} = req.body;
    //  validate the user data 
    if(!email){
        return res.status(400).json({
            success:false,
            message:"Please enter the email!"
        })
    }
    //  check user by this email in db
    const checkUser = await User.findOne({email})
    if(!checkUser){
        return res.status(404).json({
            success:false,
            message:"This email is not exits!"
        })
    }
    // deleting the previous otp of this email
        await Otp.deleteMany({ email });
    // generate 6 digit otp and send to user 
    const generateOtp = ()=> Math.floor(100000 + Math.random() * 900000)
    const otp = generateOtp()
    const expiresIn = new Date(Date.now()+ 5 * 60 * 1000)
    // store the otp in db
    const otpCreated = await Otp.create({
         email,
         otpCode:otp,
         expiresAt:expiresIn
    })
    console.log("otp code",otpCreated)
    //  if email found in db send mail to user 
    try{
       sendEmail(email,"send otp successfully",`<h1>${otp}</h1>`)
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while sending mail"
        })
    }
    // return response
    return res.status(200).json({
        success:true,
        otpCreated,
        message:"Password link send to this email!"
    })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while forget password!",
            error:error.message
        })
    }
}
export const updatePassword = async (req,res)=>{
    try{
        // get the data from the user 
        const {newPassword,confirmNewPassword,email} = req.body;
        // validate the user data
        if(!newPassword || !confirmNewPassword || !email){
            return res.status(400).json({
                success:false,
                message:"Please enter the required fields!"
            })
        }

          const getUser = await User.findOne({email})
          if(!getUser){
            return res.status(404).json({
                success:false,
                message:"Can't find user bu this email!"
            })
          }
        // hashed the newPassword
        let hashedUpdateNewPassword ;
        try{
          hashedUpdateNewPassword = await bcrypt.hash(newPassword,10)
          getUser.password = hashedUpdateNewPassword
          getUser.save()
        }catch(error){
            return res.status(500).json({
                success:false,
                message:"Error while hashing the password!",
                error:error.message
            })
        }
        // return the response
        return res.status(200).json({
            success:true,
            message:"Updated the password!"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"error while updating the password!",
            error:error.message
        })
    }
}
// verify otp
export const verifyOtp = async (req, res) => {
    try {
        // getting data from user 
        const { email, otp } = req.body;
        // validate the data from the user
        if ( !email||!otp) {
            return res.status(400).json({
                success: false,
                message: "Please provide OTP",
            });
        }
        // finding otp with this mail
        const otpRecord = await Otp.findOne({ email });
        // validate if otp found with mail or not
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "OTP not found for this email",
            });
        }
        // checking that expiresAt time is less than today time
        if (otpRecord.expiresAt < Date.now()) {
            await Otp.deleteOne({ email });
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one",
            });
        }
        // checking if the user otp and db otp is same or not
        if (otp!== otpRecord.otpCode) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please try again",
            });
        }
        // if otp match delete the db otp with this mail
        await Otp.deleteOne({ email });
        // send response
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully!",
        });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Error while verifying OTP",
            error: error.message,
        });
    }
};
// contact controller 
export const contact = async (req,res)=>{
    try{
        // get the user data
        const {fullName,email,message} = req.body;
        // validate 
        if(!fullName || !email ||!message){
            return res.status(400).json({
                success:false,
                message:"All fields are required!"
            })
        }
        // store the user data in db
        const insertData = await Contact.create({fullName,email,message})
         try{
       sendEmail(email,"thankyou for contacting us!",`<h1>thank you ${fullName} for contacting</h1>`)
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while sending mail"
        })
    }
        // show the response to the user
        return res.status(200).json({
            success:true,
            message:"Thankyou for contacting us!"
        })
    }catch(error){
        console.error("Error sending message:", error);
        return res.status(500).json({
            success: false,
            message: "Error while sending message",
            error: error.message,
        });
    }
}

export const editProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userID = req.user.id;

    if (!userID) {
      return res.status(404).json({
        success: false,
        message: "Don't find user with this id!",
      });
    }

    const user = await User.findById(userID);

    // flag for name change
    let nameChanged = false;

    if (firstName && firstName !== user.firstName) {
      user.firstName = firstName;
      nameChanged = true;
    }
    if (lastName && lastName !== user.lastName) {
      user.lastName = lastName;
      nameChanged = true;
    }
    if (email) {
      user.email = email;
    }

    // only update image if:
    // 1. name changed
    // 2. and current image is dicebear
    if (nameChanged && user.image.includes("dicebear.com")) {
      user.image = `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Updated Profile!",
      user, // return updated user object for frontend
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating profile!",
      error: error.message,
    });
  }
};

// edit user profile image
export const editProfileImage = async (req, res) => {
  try {
    // check if file uploaded
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Please provide an image!",
      });
    }

    const file = req.files.image; // field name should be "image"

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "notes-app",
      resource_type: "auto", // handles images/pdfs/videos
    });

    // get user id
    const userId = req.user.id;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "User ID not found!",
      });
    }

    // update user profile image
    const updateProfileImage = await User.findByIdAndUpdate(
      userId,
      {
        $set: { image: result.secure_url },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile Image Updated!",
      updateProfileImage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while uploading profile image!",
      error: error.message,
    });
  }
};
// edit user details and user profile image 
export const updateUserProfileDetailAndImage = async (req,res)=>{
    try{
       //get user data like firstname , lastname ,email
       const {firstName,lastName ,email} = req.body;
      //  get user image 
      const {imageURL} = req.file || (req.files && req.files.image)
    //   validate the details from the user 
    if(!firstName && !lastName && !email && !imageURL){
        return res.status(400).json({
            success:false,
            message:"At least one fields is required!"
        })
    }
    // check if user exit with id 
    const userID = req.user.id
    if(!userID){
        return res.status(400).json({
            success:false,
            message:"User id not exits!"
        })
    }
    // if exits then update with the help of id 
    const user = await User.findById(userID)
    if(firstName) user.firstName = firstName
    if(lastName)  user.lastName = lastName
    if(email)  user.email = email
    if(imageURL) user.image = image
    await user.save()
    // after updation return the response
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:false,
            message:"Error while Uploading Profile Image And Profile Details!",
            error:error.message
        })
    }
}
// delete user profile
export const deleteUserAccount = async(req,res)=>{
    try{
    //    get user id
    const userID = req.user.id;
    //   after getting id validate it
    if(!userID){
        return res.status(400).json({
            success:false,
            message:"Cannot Get User By this id!"
        })
    }
    //  after validate delete the user account
    await User.findByIdAndDelete(userID)
    // delete all notes created by this user
    await Note.deleteMany({ user: userID });
    
    // delete all categories created by this user
    await Category.deleteMany({ user: userID });
    await Feedback.deleteMany({user:userID})
    //  return the response
    return res.status(200).json({
        success:true,
        message:"Account deleted!"
    })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error while deleting Profile",
            error:error.message
        })
    }
}
// user feedback 
export const userFeedback = async(req,res)=>{
    try{
    // get data from the user 
    const {rating ,review,categoryFeedback} = req.body;
    // validate the data 
    if(!rating|| !review || !categoryFeedback){
        return res.status(400).json({
            success:false,
            message:"Fields are required!"
        })
    }
    // check for user id 
    const userId = req.user.id;
    if(!userId){
        return res.status(400).json({
            success:false,
            message:"UserId is invalid!"
        })
    }
    // insert data in feedback model
    const user = await User.findById(userId)
    if(!user){
        return res.status(400).json({
            success:false,
            message:"UserId is invalid!"
        })
    }
    const feedback = await Feedback.create({
        user,
        rating,
        review,
        feedBackCategory:categoryFeedback
    })
    // return the resposne to the user
    return res.status(200).json({
        success:true,
        message:"Feedback submitted!",
        feedback
    })
    }catch(error){
      console.log("error",error)
      return res.status(500).json({
        success:false,
        message:"Error in server while user feeedback! ",
        error:error.message,
      })
    }
    
}
// get feedback from the user
export const getFeedback = async(req,res)=>{
try{   
    const userFeedbacks = await Feedback.find({feedBackCategory:"General Feedback"}).populate("user");
    if(!userFeedbacks){
        return res.status(400).json({
            success:false,
            message:"No User Feedback available!"
        })
    }
    return res.status(200).json({
        success:true,
        message:"User Feddbacks!",
        userFeedbacks
    })
}catch(error){
    console.log("error",error)
      return res.status(500).json({
        success:false,
        message:"Error in server while fetching feeedback! ",
        error:error.message,
      })
}
}