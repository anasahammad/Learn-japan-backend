import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema({
    name: { type: String, required: true },
    lessonNumber: { type: Number, required: true, unique: true },
    vocabularyCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
  },
{timestamps: true});
  
  export const Lesson = mongoose.model('Lesson', lessonSchema);
  