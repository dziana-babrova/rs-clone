import { Schema, model } from 'mongoose';

export interface IUser {
  _id: Schema.Types.ObjectId;
  email: string;
  username: string;
  password: string;
}

const User = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  password: { type: String },
});

export default model('user', User);
