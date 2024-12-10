import { Lesson } from "../models/lessons.model.js";
import { Vocabulary } from "../models/vocabulary.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createLesson = asyncHandler(async (req, res) => {
  const { name, lessonNumber } = req.body;
  console.log(name);

  if (name === "" || lessonNumber === null) {
    throw new ApiError(400, "All fields are required");
  }

  const existedLesson = await Lesson.findOne({ lessonNumber });

  if (existedLesson) {
    throw new ApiError(409, "This lesson is already exist");
  }

  const lesson = await Lesson.create({
    name,
    lessonNumber,
  });

  return res.status(201).json(new ApiResponse(200, lesson));
});

const getAllLessons = asyncHandler(async (req, res) => {
  const allLessons = await Lesson.find();
  return res
    .status(200)
    .json(new ApiResponse(200, allLessons, "All Lesson fetched Successfully"));
});

const updateLesson = asyncHandler(async (req, res) => {
  const { name, lessonNumber } = req.body;
 
  
  const lesson = await Lesson.findByIdAndUpdate(
    req.params.lessonId, 
    {
      $set: {
        name,
        lessonNumber,
      },
    },
    { new: true }
  );

  if (!lesson) {
    throw new ApiError(404, "Lesson not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lesson, "Lesson Updated Successfully"));
});

const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.lessonId);

  await Vocabulary.deleteMany({ lessonNo: lesson.lessonNumber });
  return res
    .status(200)
    .json(new ApiResponse(200, "Lesson Deleted Successfully"));
});

export { createLesson, getAllLessons, updateLesson, deleteLesson };
