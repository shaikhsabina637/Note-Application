import { changePassword, contact, deleteUserAccount, editProfile, editProfileImage, forgetPassword, login, signup, updatePassword, verifyOtp,userFeedback,getFeedback } from "../controllers/auth.controller.js";
import { auth ,isUser} from "../middleware/auth.middleware.js";
import express from "express"
const router = express.Router()
router.post("/signup",signup)
router.post("/login",login)
router.post("/changepassword",auth,isUser,changePassword)
router.post("/forgetpassword",forgetPassword)
router.post("/verifyotp",verifyOtp)
router.post("/updatepassword",updatePassword)
router.post("/contact",contact)
router.put("/editprofile",auth,isUser,editProfile)
router.post("/editprofileimage",auth,isUser,editProfileImage)
router.delete("/deleteprofile",auth,isUser,deleteUserAccount)
router.post("/userfeedback",auth,isUser, userFeedback)
router.get("/getFeedback",getFeedback)
export default router;