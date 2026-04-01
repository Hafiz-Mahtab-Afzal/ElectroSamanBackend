import GenerateTokenAndUser from "../utils/GenerateTokenAndUserResponse.js"
import { catchErr,error,success,warning } from "../utils/messages.js"
import { AWS_SES, CLIENT_URL } from "../config/aws.js"
import EmailTemplate from "../helpers/EmailTemplate.js"
import evalidator from 'email-validator'
import Schema from 'password-validator'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { nanoid } from 'nanoid'
import user from "../models/user.models.js"


 const pvalidator = new Schema
 pvalidator
.is().min(8)                                    // Minimum length 8
.is().max(30)                                  // Maximum length 100
.has().uppercase(1)                              // Must have uppercase letters
.has().lowercase(1)                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// 1) sent verification link to emailadress /api/v1/pre-sign-up
const preSignup = async (req,res) => {
    try{
      const {first_name,last_name,email,password,confirm_password} = req.body
      const existemail = await user.findOne({email})

    // email exist to nahi karti
    if(existemail){
      return error(`This Email ${email} is already registered , try with different email`,res)
    }
    // passsword validator
    if(!pvalidator.validate(password)){
        return warning("Password must be 8 to 30 digits,should have 1 uppercase letter,1lowercase letter,and should have 2 digits",res)
    }
  
    // ab ham in sab ka token create karan ga 
    const token = jwt.sign({first_name,last_name,email,password},process.env.JWT_SECRET,{expiresIn:"4h"})
    console.log(token)
    // yahan ham na jo token banaya ha wo jis user na apni information type ki han unhan send kar raha han wo token us ki email par usa mila ga jis par click karna par wo login ka page par poonch jaya ga 
    AWS_SES.sendEmail(EmailTemplate(
             email,
             " Signup verification Link ",
             `<p > <a href="${CLIENT_URL}/${token}" style="font-size:12px; color:yellow; hover:text-blue; focus:text-orange letter-spacing:8px" > ${token} </a> </p>`
          ),
          (err,data) => {
            if(err){
                console.log(err.message)
            }
            if(data){
                success(" we have sent you a verification link please check your email address ",res)
            }
          }
        )  
    }
    catch(err){
      catchErr(err,res)
    }
}
// 2) create new account after decode the token /api/v1/signup
const signup = async (req,res) => {
    try{
    const token =  req.body.token
    const {first_name,last_name,email,password} = jwt.verify(token,process.env.JWT_SECRET)
    // encrypt the password before saving into database
    const salt = await bcryptjs.genSalt(12)
    const hashpassword = await bcryptjs.hash(password,salt)
    const emailfound = await user.findOne({email})
    if(emailfound){
      return error(`This email ${email} is already registered,may be you click on link again`,res)
    }
    // now finally create the account
    await user({
         first_name,
         last_name,
         email,
         password:hashpassword
    }).save()

    success(`${first_name} ${last_name},your account have been created`,res)

    }
    catch(err){
      catchErr(err,res)
    }
}
// 3) logged in with your credientials /login
const login = async (req,res) => {
     try{
     const {email,password} = req.body
     const User = await user.findOne({email})
     if(!email || !password){
       return warning("both fields are required",res)
     }
     if(!evalidator.validate(email)){
       return warning("email is not valid",res)
     }
     if(!User){
       return error("This email is not registered",res)
     }
     const isMatchedpassword = await bcryptjs.compare(password,User.password)
     if(!isMatchedpassword){
       return error("Wrong password",res)
     }
     
     GenerateTokenAndUser(User,req,res,"you are successsfuly logged In")
     }
     catch(err){
        catchErr(err,res)
     }
}
// 4) we will send you otp for password recovery /api/v1/pre-sign-up
const forgetPassword = async (req,res) => {
    try{
      const email =  req.body.email
      const User = await user.findOne({email})
      if(!email){
        error("please enter your email",res)
      }
      if(!evalidator.validate(email)){
        warning("This email is not valid",res)
      }
      if(!User){
        error(`This email ${email} is not registered`,res)
      }
      const otp = nanoid(5).toUpperCase()
      // ham jo otp save karan ga wo bcrypt kar ka karan ga 
      // const salt = await bcryptjs.genSalt(12)
      // const hashotp = await bcryptjs.hash(otp,salt)
      User.otp = otp
      await User.save()
      
      AWS_SES.sendEmail(EmailTemplate(
             email,
             " forget password OTP ",
             `<p> Below is your otp </p>
              <span style="font-size:45px; color:orange; letter-spacing:8px"> ${otp} </span>
             `
          ),
          (err,data) => {
            if(err){
                console.log(err.message)
            }
            if(data){
                success(" We have sent you otp please check your email address ",res)
            }
          }
        )  
 
    }
    catch(err){
       catchErr(err,res)
    }
}
// 5) user ko otp send kar di ha
const otp = async (req,res) => {
     try{
        const otp = req.body.otp
        
        // 1) otp wali field khali nahi honi chaiya
        console.log(otp)
        if(!otp){
         return error("Please Enter OTP",res)
        }
        // 2) jo ham na otp likhi aur jo database ma ha wo same honi chaiya
        const existotp = await user.findOne({otp})
        // const compareotp = await bcryptjs.compare(otp,emailexist.otp)
        if(!existotp){
         return warning("Wrong OTP",res)
        }
        const token = nanoid(32)
        existotp.resetToken = token
        success({ message: "Reset Your Password", token: existotp.resetToken },res)
        existotp.otp = "";
        await existotp.save()
        
     }
     catch(err){
         catchErr(err,res)
     }
}
// 6) with that otp you can reset your password /api/v1/pre-sign-up
const resetPassword = async (req,res) => {
        
        try{
          const {password,confirm_password} = req.body
           
          if(!password || !confirm_password){
            return error("Both fields are required",res)
          }
          if(!pvalidator.validate(password)){
            return warning("Password must be 8 to 30 digits,should have 1 uppercase letter,1lowercase letter,and should have 2 digits",res)
          }
          if(password != confirm_password){
            return warning("Password and confirm password must be matched",res)
          }

          const salt = await bcryptjs.genSalt(12)
          const hashpassword = await bcryptjs.hash( password ,salt)
          await user.findOneAndUpdate({resetToken:req.params.token},{ password: hashpassword },{new:true})
          
          success("Your password has been changed",res)

        }
        catch(err){
         catchErr(err,res)
        }
}
// 7) Show all users by Admin
const Showallusers = async (req,res) => {
      const users = await user.find()
      const length   = users.length
     
       try{
            if(length==0){
               return res.json({
                   display:"No User"
               })
            }
            {
             res.json({
               display:`we have ${length} users `,
               users:users
             })
            }
       }
       catch(err){
         return res.json({
         error:err.message
       })
      }  
}
// 8) admin can block any user
const userblocked = async (req,res) => {
     try {
        const uid = req.params.id
        await user.findByIdAndUpdate({_id:uid},{isblocked:true},{new:true})
        res.json({
          success:"Status Updated Successfully"
        })
        console.log(uid)
     } 
     
     catch(err){
         return res.json({
         error:err.message
       })
      }
}
// 9) fetch user logged
const fetchLoggedUser = async (req,res) => {
      try{const id = req.user.id
      const User = await user.findById(id)
      res.json(user)
      }
      catch(err){
         return res.json({
         error:err.message
       })
      }
} 

export {
  preSignup,
  signup,
  login,
  forgetPassword,
  otp,
  resetPassword,
  Showallusers,
  userblocked,
  fetchLoggedUser
}
