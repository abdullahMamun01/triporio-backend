import { model, Schema } from 'mongoose';
import TUserFollowRelations from './follow.interface';

const FollowSchema = new Schema<TUserFollowRelations>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Ensure it matches the interface
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Ensure it matches the interface
  },
  { timestamps: true, versionKey: false },
);

const FollowModel = model<TUserFollowRelations>('Follow', FollowSchema);

export default FollowModel;
