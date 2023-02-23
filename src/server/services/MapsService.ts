import { Schema } from 'mongoose';
import ApiError from '../errors/ApiError';
import Maps, { MapDescription } from '../models/Maps';

class MapsService {
  async findMaps(userId: Schema.Types.ObjectId) {
    const dbMaps = await Maps.findOne({ user: userId });
    if (!dbMaps) {
      throw ApiError.NotFound(`Maps for user ${userId} not found.`);
    }
    return dbMaps.maps;
  }

  async updateMaps(userId: Schema.Types.ObjectId, maps: MapDescription[]) {
    const dbMaps = await Maps.findOne({ user: userId });
    if (dbMaps) {
      dbMaps.maps = maps;
      await dbMaps.save();
      return;
    }
    await Maps.create({ user: userId, maps });
  }

  async createMaps(userId: Schema.Types.ObjectId, maps: MapDescription[]) {
    const potentialMaps = await Maps.findOne({ user: userId });
    if (potentialMaps) {
      throw ApiError.BadRequest('Maps for this user already exists.');
    }
    const stars = maps.reduce((acc, el) => acc + el.stars, 0);
    const mapsObj = new Maps({ user: userId, maps, stars });
    await mapsObj.save();
  }
}

export default new MapsService();
