import { Document, Schema, Types, model } from "mongoose";
import { hash, compare, genSalt } from "bcrypt";

interface AuthVerificationTokenDocument extends Document {
  owner: Types.ObjectId;
  token: string;
  createdAt: Date;
}

interface Methods {
  compareToken(token: string): Promise<boolean>;
}

const schema = new Schema<AuthVerificationTokenDocument, {}, Methods>({
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
    expires: 86400, // 60 minutes * 60 seconds * 24 = 24 hrs
    default: Date.now(),
  },
});

schema.pre("save", async function () {
  if (this.isModified("token")) {
    const salt = await genSalt(10);
    this.token = await hash(this.token, salt);
  }
});

schema.methods.compareToken = async function (token) {
  return await compare(token, this.token);
};

const AuthVerificationTokenModal = model("AuthVerificationToken", schema);
export default AuthVerificationTokenModal;
