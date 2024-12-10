import { Router } from "express";

import { createTutorial, getAllTutorials, updateTutorial, deleteTutorial } from "../controllers/tutorial.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";


const router = Router()


router.route("/add").post(verifyJWT, isAdmin,createTutorial)
router.route("/").get(getAllTutorials )
router.route("/update-tutorial/:id").patch(updateTutorial )
router.route("/:id").delete(deleteTutorial )

export default router
