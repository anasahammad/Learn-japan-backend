import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access or refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // step 1: get user details from the frontend
  const { name, email, password } = req.body;
  //  console.log("email: ", email);

  // step 2: Validation- not empty
  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // step 3: check user already exist : username, email
  const existedUser = await User.findOne({
    email,
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email is already exist");
  }

  // step 4: check for images, check for avatar from the multer
  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // step 5: upload them to cloudinary, avatar, coverimage
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // step 6: create user object - create entry in the db
  const user = await User.create({
    email,
    name,
    avatar: avatar.url,
    password,
  });

  // step 7: remove password and refreshToken fields from the response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // step 8: return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({email});

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logout Successful"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// const changeCurrentPassword = asyncHandler(async(req, res)=>{
//   const {oldPassword, newPassword} = req.body;

//   const user = await User.findById(req?.user._id)

//   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

//   if(!isPasswordCorrect){
//     throw new ApiError(400, "Invalid Old Password")
//   }

//   user.password = newPassword
//   await user.save({validateBeforeSave: false})

//   return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))

// })

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched Successfully"));
});
const getAllUsers = asyncHandler(async (req, res) => {
    const allUsers = await User.find()
  return res
    .status(200)
    .json(new ApiResponse(200, allUsers, "All User fetched Successfully"));
});

// const updateUserDetails = asyncHandler(async(req, res)=>{
//   const {fullName, email} = req.body;

//   if(!fullName || !email){
//     throw new ApiError(400, "All fields are required")
//   }

//   const user = await User.findByIdAndUpdate(req.user._id, {
//     $set: {
//        fullName,
//        email
//     }
//   }, {new: true}).select("-password")

//   return res
//   .status(200)
//   .json(new ApiResponse(200, user, "Account Details Updated Successfully"))

// })

// const updateUserAvatar = asyncHandler(async(req, res)=>{

//   const avatarLocalPath = req.file?.path
//   if(!avatarLocalPath){
//     throw new ApiError(400, "Avatar file is missing")

//   }

//     const deleteAvatar = await deleteOnCloudinary(req.user?.avatar)

//   const avatar = await uploadOnCloudinary(avatarLocalPath)

//   if(!avatar.url){
//     throw new ApiError(400, "Error while uploading on avatar")
//   }

//   const updateAvatar = await User.findByIdAndUpdate(req?.user._id, {
//     $set: {
//       avatar: avatar.url
//     }
//   }, {new: true}).select("-password")

//   return res
//   .status(200)
//   .json(new ApiResponse(200, updateAvatar, "Avatar Updated Successfully"))
// })

//same as coverImage update

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  getAllUsers
};
