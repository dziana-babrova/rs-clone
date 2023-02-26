import { Colors } from 'common/types/enums';

const key = 'rsCloneMiniGolf';

export const LocalStorageKeys = {
  lang: `${key}Lang`,
  music: `${key}Music`,
  sound: `${key}Sound`,
  background: `${key}Background`,
  maps: `${key}Maps`,
  accessToken: `${key}-access-token`,
};

export const SERVER_PROPS = {
  URL: 'http://localhost:3000/api',
  ONLINE: 'http://localhost:3000/',
};

export const STYLE = {
  font: 'Montserrat',
  lightText: Colors.Primary,
  darkText: Colors.Secondary,
};

export const hotkeys = {
  mute: 'D',
  sounds: 'S',
  music: 'M',
  levels: 'L',
  info: 'I',
  restart: 'R',
  back: 'ESC',
  winners: 'W',
};
