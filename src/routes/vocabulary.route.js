import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { createVocabulary, getVocabulariesByLessonNo, updateVocabulary, deleteVocabulary } from "../controllers/vocabulary.controller.js";



const router = Router()


router.route("/create-vocabulary").post(verifyJWT, isAdmin, createVocabulary)

router.route("/:lessonNo").get(verifyJWT, isAdmin,getVocabulariesByLessonNo)
router.route("/update-vocabulary/:id").patch(verifyJWT, isAdmin,updateVocabulary)
router.route("/:id").delete(verifyJWT, isAdmin, deleteVocabulary)


export default router