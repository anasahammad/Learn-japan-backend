import { Router } from "express"
import { getAllUsers, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js"

const router = Router()

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]),registerUser)

router.route("/login").post(loginUser)
//secure
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


router.route("/current-user").get(verifyJWT ,getCurrentUser)
router.route("/").get(verifyJWT, isAdmin,getAllUsers)








export default router