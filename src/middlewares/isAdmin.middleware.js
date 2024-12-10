import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const isAdmin = asyncHandler(async(req, res, next)=>{
    console.log(req)
    try {
       const user = await User.findById(req.user._id)
        if(user.role !== 'admin'){
            throw new ApiError(401, "Only Admin can get the users")
        }
        next()
    } catch (error) {
        throw new ApiError(401, error?.message ||  "There something wrong")
    }
})