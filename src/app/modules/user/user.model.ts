import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';
import { hashedPassword } from './user.utils';

// Create the Mongoose schema
const userSchema = new Schema<TUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: false,
      default: false,
    },
    bio: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false, // Optional personal website or blog
    },
    socialLinks: {
      type: {
        facebook: String,
        twitter: String,
        instagram: String,
        linkedin: String,
      },
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.pre('save', async function (next) {
  this.password = await hashedPassword(this.password);
  next();
});

// Create the Mongoose model
const UserModel = model<TUser>('User', userSchema);

export default UserModel;
