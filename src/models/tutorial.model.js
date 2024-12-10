import mongoose, { Schema } from "mongoose";


const tutorialSchema = new Schema({
    title: { type: String, required: true }, 
  videoUrl: { type: String, required: true }, 
  uploadedBy: {type: String, required: true}
   
}, {
    timestamps: true
})

export const Tutorial = mongoose.model("Tutorial", tutorialSchema)

