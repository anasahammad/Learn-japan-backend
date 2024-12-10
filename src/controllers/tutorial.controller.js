import { Tutorial } from "../models/tutorial.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const createTutorial = asyncHandler(async(req, res)=>{
    const {title, videoUrl} = req.body;

    if(!title){
        throw new ApiError(400, "Title  are required")
    }

    

      const tutorial = await Tutorial.create({
        title,
        videoUrl,
        uploadedBy: req?.user?.email
        
      });

      return res
      .status(200)
      .json(new ApiResponse(200, tutorial, "Tutorial added successfully"));
   
})


const getAllTutorials = asyncHandler(async(req, res)=>{
    const tutorials = await Tutorial.find()
    return res
    .status(200)
    .json(new ApiResponse(200, tutorials, "All Tutorial fetched Successfully"));
})

const updateTutorial = asyncHandler(async (req, res) => {
    const { title, videoUrl } = req.body;
    
    const tutorial = await Tutorial.findByIdAndUpdate(
      req.params.id, 
      {
        $set: {
            title, videoUrl
        },
      },
      { new: true }
    );
  
    if (!tutorial) {
      throw new ApiError(404, "Tutorial not found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, tutorial, "Tutorial Updated Successfully"));
  });


  const deleteTutorial = asyncHandler(async (req, res) => {
    
     await Tutorial.findByIdAndDelete(req.params.id);
  

    return res
      .status(200)
      .json(new ApiResponse(200, "Tutorial Deleted Successfully"));
  });




export {createTutorial, getAllTutorials, updateTutorial, deleteTutorial}