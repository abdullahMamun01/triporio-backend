import { model, Schema } from "mongoose";
import categoryList from "../post.constants";
import TPost from "../interface/post.interface";


const postSchema = new Schema<TPost>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      images: {
        type: [String],
        required: true,
      },
      categories: {
        type: [String],
        enum: categoryList, 
        required: true,
      },
      premium : {
        type: Boolean ,
        default:false ,
        required:false
      }
    },
    { timestamps: true } 
  );
  
  // Create the Post model
  const PostModel = model<TPost>("Post", postSchema);

  export default PostModel