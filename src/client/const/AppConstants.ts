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

export const serverProps = {
  URL: 'https://rs-clone-server-production-369a.up.railway.app/api/',
  ONLINE: 'https://rs-clone-server-production-369a.up.railway.app/',
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

export const STYLE = {
  font: 'Montserrat',
  lightText: Colors.Primary,
  darkText: Colors.Secondary,
};
