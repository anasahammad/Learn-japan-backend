import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js"
import { createLesson, getAllLessons, updateLesson, deleteLesson } from "../controllers/lesson.controller.js"

const router = Router()


router.route("/create-lesson").post(verifyJWT, isAdmin, createLesson)

router.route("/").get(verifyJWT, isAdmin,getAllLessons)
router.route("/update-lesson/:lessonId").patch(verifyJWT, isAdmin,updateLesson)
router.route("/:lessonId").delete(verifyJWT, isAdmin,deleteLesson)


export default router