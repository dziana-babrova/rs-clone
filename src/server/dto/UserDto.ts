import { Schema } from 'mongoose';
import { IUser } from '../models/User';

export default class UserDto {
  id;

  email;

  username;

  /* eslint no-underscore-dangle: 0 */
  constructor(model: IUser & { _id: Schema.Types.ObjectId }) {
    this.id = model._id;
    this.email = model.email;
    this.username = model.username;
  }
}
