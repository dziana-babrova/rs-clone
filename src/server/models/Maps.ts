import { Schema, model } from 'mongoose';

export type MapDescription = {
  id: number,
  isUnlock: boolean,
  stars: number
};

export interface IMap {
  user: Schema.Types.ObjectId;
  maps: MapDescription[];
  stars: number;
}

const Maps = new Schema<IMap>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  maps: { type: [Object], required: true },
  stars: { type: Number, required: true },
});

export default model('maps', Maps);
