import { model, Schema } from "mongoose";
import TVerification from "./verification.interface";


const verificationSchema = new Schema<TVerification>({
  userId: { type: Schema.Types.ObjectId, required: true },
  token: { type: String, required: true },
  email:  { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
} , {timestamps: true , versionKey:false});



const VerficationModel = model<TVerification>("Verfication" ,verificationSchema)

export default VerficationModel
