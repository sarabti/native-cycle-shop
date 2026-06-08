import { Document, Model, Schema, Types, model } from "mongoose";
import { hash, compare, genSalt } from "bcrypt";

export interface AuthVerificationTokenDocument extends Document {
  owner: Types.ObjectId;
  token: string;
  createdAt: Date;
}

export interface AuthVerificationTokenMethods {
  compareToken(token: string): Promise<boolean>;
}

export type AuthVerificationTokenModel = Model<
  AuthVerificationTokenDocument,
  {},
  AuthVerificationTokenMethods
>;

const tokenSchema = new Schema<
  AuthVerificationTokenDocument,
  AuthVerificationTokenModel,
  AuthVerificationTokenMethods
>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 86400,
    default: Date.now,
  },
});

tokenSchema.pre("save", async function () {
  if (this.isModified("token")) {
    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
  }
});

tokenSchema.methods.compareToken = async function (
  token: string,
): Promise<boolean> {
  return compare(token, this.token);
};

const AuthVerificationTokenModel = model<
  AuthVerificationTokenDocument,
  AuthVerificationTokenModel
>("AuthVerificationToken", tokenSchema);

export default AuthVerificationTokenModel;
