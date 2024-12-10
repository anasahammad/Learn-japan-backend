import mongoose, { Schema } from "mongoose";


const vocabularySchema = new Schema({
    word: { type: String, required: true },
    pronunciation: { type: String, required: true },
    meaning: { type: String, required: true },
    whenToSay: { type: String, required: true },
    lessonNo: { type: Number, required: true },
    createdBy: { type: String, required: true },
 
  },
{
    timestamps: true
});
  
 export const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);
  