import {  Types } from 'mongoose';


type TComment = {
  user: Types.ObjectId;
  post: Types.ObjectId;
  comment: string
};


export type TUpdateComment = {
  user: Types.ObjectId;
  commentId: Types.ObjectId;
  newComment: string
}

export default TComment;
