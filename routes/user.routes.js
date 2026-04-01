import express from 'express'
import * as auth  from "../controllers/user.controllers.js"
import { checkrole, requriedLoggedIn } from '../middlewares/authMiddleware.js'

const users = express.Router()

/* these are not protected routes not required login */
users.post("/pre-signup",auth.preSignup)
users.post("/signup",auth.signup)
users.post("/login",auth.login)
users.post("/forget-password",auth.forgetPassword)
users.post("/otp",auth.otp)
users.put("/reset-password/:token",auth.resetPassword)
users.get("/users",auth.Showallusers)
users.put("/block/:id", auth.userblocked)

/* these are protected routes required login */

users.get("/users",requriedLoggedIn, checkrole, auth.Showallusers)

users.get("/logged-user",requriedLoggedIn,auth.fetchLoggedUser)

export default users;