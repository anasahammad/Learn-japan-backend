import cookieParser from 'cookie-parser'
import express from 'express'
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended : true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//import routers
import userRouter from "./routes/user.route.js"
import lessonRouter from "./routes/lesson.route.js"
import vocabularyRouter from "./routes/vocabulary.route.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/lessons", lessonRouter)
app.use("/api/v1/vocabulary", vocabularyRouter)

export {app}