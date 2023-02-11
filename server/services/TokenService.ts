import jwt from 'jsonwebtoken';
import { Schema } from 'mongoose';
import UserDto from '../dto/UserDto';
import Token from '../models/Token';

class TokenService {
  generateTokens(payload: UserDto) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '24h',
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '30d',
    });
    return { accessToken, refreshToken };
  }

  async saveToken(userId: Schema.Types.ObjectId, refreshToken: string) {
    const dbToken = await Token.findOne({ user: userId });
    if (dbToken) {
      dbToken.refreshToken = refreshToken;
      return dbToken.save();
    }
    const token = await Token.create({ user: userId, refreshToken: refreshToken });
    return token;
  }

  async removeToken(refreshToken: string) {
    const token = Token.deleteOne({ refreshToken });
    return token;
  }

  async findToken(refreshToken: string) {
    const token = Token.findOne({ refreshToken });
    return token;
  }

  validateAccessToken<T>(token: string): T | null {
    try {
      const data = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as T;
      return data;
    } catch (e) {
      return null;
    }
  }
  validateRefreshToken<T>(token: string): T | null {
    try {
      const data = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as T;
      return data;
    } catch (e) {
      return null;
    }
  }
}

export default new TokenService();
