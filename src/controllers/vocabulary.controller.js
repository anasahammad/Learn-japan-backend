import { Lesson } from "../models/lessons.model.js";
import { Vocabulary } from "../models/vocabulary.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createVocabulary = asyncHandler(async (req, res) => {
  const { word, pronunciation, meaning, whenToSay, lessonNo } = req.body;
 
    
  if (
    [word, pronunciation, meaning, whenToSay].some(
      (field) => field?.trim() === ""
    ) ||
    !lessonNo
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const lesson = await Lesson.findOne({ lessonNumber: lessonNo });


 
  if (!lesson) {
    throw new ApiError(409, "Lesson Does not exist");
  }

  const vocabulary = await Vocabulary.create({
    word,
    pronunciation,
    meaning,
    whenToSay,
    lessonNo,
    createdBy: req.user?.email,
  });

  //update vocabularyCount
  lesson.vocabularyCount +=1;
  await lesson.save()
  return res.status(201).json(new ApiResponse(200, vocabulary));
});


const getVocabulariesByLessonNo = asyncHandler(async(req, res)=>{
    const vocabularies = await Vocabulary.find({lessonNo: req.params.lessonNo});

    console.log("Vocabulary No " ,req.params.lessonNo)
    return res
      .status(200)
      .json(new ApiResponse(200, vocabularies, "Vocabularies fetched Successfully"));
})


const updateVocabulary = asyncHandler(async (req, res) => {
    const { word, pronunciation, meaning, whenToSay, lessonNo } = req.body;
    
  
    
    const vocabulary = await Vocabulary.findByIdAndUpdate(
      req.params.id, 
      {
        $set: {
            word, pronunciation, meaning, whenToSay, lessonNo
        },
      },
      { new: true }
    );
  
    if (!vocabulary) {
      throw new ApiError(404, "Vocabulary not found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, vocabulary, "Vocabulary Updated Successfully"));
  });


  const deleteVocabulary = asyncHandler(async (req, res) => {
    
    console.log(req.params.id)
    const vocabulary = await Vocabulary.findByIdAndDelete(req.params.id);
  
    const lesson = await Lesson.findOne({lessonNumber: vocabulary.lessonNo})

    if(lesson){
        lesson.vocabularyCount -=1;
        await lesson.save()
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Lesson Deleted Successfully"));
  });


  export {createVocabulary,getVocabulariesByLessonNo, updateVocabulary, deleteVocabulary }
