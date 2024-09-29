import { Schema } from 'mongoose';

type TReply = {
  parentId: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  replies: string;
};

type TComment = {
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  comment: {
    description: string;
    replies?: TReply[];
  };
};

export default TComment;
