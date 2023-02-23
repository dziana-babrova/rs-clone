import bcrypt from 'bcrypt';
import UserDto from '../dto/UserDto';
import ApiError from '../errors/ApiError';
import User, { IUser } from '../models/User';
import TokenService from './TokenService';

export type AuthApiResponse = {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
};

class UserService {
  async sigUp(email: string, username: string, password: string) {
    const potentialUser = await User.findOne({ email });
    if (potentialUser) {
      throw ApiError.BadRequest('User with this email already exists.');
    }
    const hashPassword = bcrypt.hashSync(password, 7);
    const user = new User({ email, username, password: hashPassword });
    await user.save();
    const data = await this.getAndSaveData(user);
    return data;
  }

  async signIn(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.NotFound(`User ${email} not found.`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Wrong password');
    }
    const data = await this.getAndSaveData(user);
    return data;
  }

  async signOut(refreshToken: string) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const tokenData = TokenService.validateRefreshToken<UserDto>(refreshToken);
    const dbToken = await TokenService.findToken(refreshToken);
    if (!tokenData || !dbToken) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findById(tokenData.id);
    let data;
    if (user) {
      data = await this.getAndSaveData(user);
    } else {
      data = await this.getAndSaveData({
        _id: tokenData.id,
        email: tokenData.email,
        username: tokenData.username,
        password: '',
      });
    }
    return data;
  }

  async getAndSaveData(user: IUser): Promise<AuthApiResponse> {
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: userDto,
    };
  }
}

export default new UserService();
