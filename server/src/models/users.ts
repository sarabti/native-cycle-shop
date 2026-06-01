import { Document, Schema, model } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  tokens: string[];
  avatar?: { url: string; id: string };
}

interface Methods {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    tokens: [String],
    avatar: {
      type: Object,
      url: String,
      id: String,
    },
  },
  { timestamps: true },
);

const UserModel = model("User", userSchema);
export default UserModel;
