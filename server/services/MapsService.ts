import { LocalStorageKeys } from 'const/AppConstants';
import { Schema } from 'mongoose';
import LocalStorageService from 'services/LocalStorageService';
import { setMaps } from 'state/features/AppSlice';
import store from 'state/store';
import { Maps } from 'types/types';
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
    const mapsObj = new Maps({ user: userId, maps });
    await mapsObj.save();
  }

  static getMapsFromLS() {
    const maps: Maps | null = LocalStorageService.getItem(LocalStorageKeys.maps);
    if (maps === null) {
      console.log();
    } else {
      store.dispatch(setMaps(maps));
    }
  }
}

export default new MapsService();
