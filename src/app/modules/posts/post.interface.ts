import { Schema } from 'mongoose';
import categoryList from './post.constants';

type TCategoryList = typeof categoryList;

type TPost = {
  user: Schema.Types.ObjectId;
  title: string;
  description: string;
  images: string[];
  categories: TCategoryList;
  premium?: false;
  isDeleted?: boolean ,
  isActive?:boolean
};

export default TPost;
