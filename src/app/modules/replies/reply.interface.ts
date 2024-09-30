import { Types } from 'mongoose';

type TReply = {
  commentId: Types.ObjectId;
  user: Types.ObjectId;
  reply: string;
};

export default TReply;
