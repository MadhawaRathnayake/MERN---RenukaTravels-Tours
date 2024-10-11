import mongoose from "mongoose";

const detinationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique:true,
    },
    image:{
      type:String,
      default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
    },
    isAdmin:{
      type:Boolean,
      default:false,
     },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;