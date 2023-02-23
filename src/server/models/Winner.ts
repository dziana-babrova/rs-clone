import { Schema, model } from 'mongoose';

export interface IWinner {
  user: Schema.Types.ObjectId;
  username: string;
  stars: number;
}

const Winner = new Schema<IWinner>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  username: { type: String, required: true },
  stars: { type: Number, required: true },
});

export default model('winner', Winner);
