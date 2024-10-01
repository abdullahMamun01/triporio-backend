import { Types } from 'mongoose';

type TUserFollowRelations = {
  user: Types.ObjectId;
  following: Types.ObjectId[];
  followers?: Types.ObjectId[];
};


export default TUserFollowRelations
