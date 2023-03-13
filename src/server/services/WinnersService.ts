import ApiError from '../errors/ApiError';
import Maps from '../models/Maps';
import User from '../models/User';

class WinnersService {
  async getWinners() {
    const dbMaps = await Maps.find().sort({ stars: 'desc' }).limit(10);
    const filteredMaps = dbMaps.filter((el) => el.stars > 0);
    if (!filteredMaps.length) {
      throw ApiError.NotFound('Winners is empty.');
    }
    const result = filteredMaps.map(async (el) => {
      const user = await User.findById(el.user);
      const username = user?.username || 'Anonymous';
      return {
        username,
        stars: el.stars,
      };
    });
    return result;
  }
}

export default new WinnersService();
