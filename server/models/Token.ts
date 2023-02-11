import { Schema, model } from 'mongoose';

export interface IToken {
  user: Schema.Types.ObjectId;
  refreshToken: string;
}

const Token = new Schema<IToken>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
});

export default model('token', Token);
