import { Document, Model, Schema, model } from "mongoose";
import { hash, compare, genSalt } from "bcrypt";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  tokens: string[];
  avatar?: {
    url: string;
    id: string;
  };
}

export interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type UserModel = Model<UserDocument, {}, UserMethods>;

const userSchema = new Schema<UserDocument, UserModel, UserMethods>(
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
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return compare(password, this.password);
};

const UserModel = model<UserDocument, UserModel>("User", userSchema);

export default UserModel;
