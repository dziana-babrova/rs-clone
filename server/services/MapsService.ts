import { Schema } from 'mongoose';
import ApiError from '../errors/ApiError';
import Maps, { MapsType } from '../models/Maps';

class MapsService {
  async findMaps(userId: Schema.Types.ObjectId) {
    const dbMaps = await Maps.findOne({ user: userId });
    if (!dbMaps) {
      throw ApiError.NotFound(`Maps for user ${userId} not found.`);
    }
    return dbMaps.maps;
  }

  async updateMaps(userId: Schema.Types.ObjectId, maps: MapsType) {
    const dbMaps = await Maps.findOne({ user: userId });
    console.log(dbMaps);
    if (dbMaps) {
      dbMaps.maps = maps;
      await dbMaps.save();
      return;
    }
    await Maps.create({ user: userId, maps });
  }
}

export default new MapsService();
