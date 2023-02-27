import { ControlKeys, HotkeysKeys } from 'common/types/enums';

const INFO_POPUP = {
  developers: [
    {
      name: 'Dziana Babrova',
      username: 'dziana-babrova',
      link: 'https://github.com/dziana-babrova',
    },
    {
      name: 'Alexandr Chebatul',
      username: 'sashkill94',
      link: 'https://github.com/dziana-babrova',
    },
    {
      name: 'Irina Nazarova',
      username: 'irinkwink',
      link: 'https://github.com/irinkwink',
    },
  ],
  links: {
    rsSchool: {
      text: 'logo RS School',
      link: 'https://rs.school/js/',
      src: '/assets/rs-school-js.svg',
    },
    copyright: {
      text: '© MiniGolf, 2023',
      link: 'https://github.com/dziana-babrova/rs-clone',
    },
  },
  controlKeys: {
    game: [
      ControlKeys.Space,
      ControlKeys.UpDown,
      ControlKeys.LeftRight,
    ],
    multiplayer: [
      ControlKeys.MultiSpaceLocal,
      ControlKeys.MultiUpLocal,
    ],
    online: [
      ControlKeys.MultiSpaceOnline,
    ],
  },
  hotkeys: {
    start: [
      HotkeysKeys.Info,
      HotkeysKeys.Mute,
      HotkeysKeys.Sounds,
      HotkeysKeys.Music,
      HotkeysKeys.Restart,
      HotkeysKeys.Levels,
      HotkeysKeys.Winners,
      HotkeysKeys.Back,
    ],
    game: [
      HotkeysKeys.Mute,
      HotkeysKeys.Sounds,
      HotkeysKeys.Music,
      HotkeysKeys.Levels,
      HotkeysKeys.Info,
      HotkeysKeys.Restart,
      HotkeysKeys.Back,
    ],
    multiplayer: [
      HotkeysKeys.Mute,
      HotkeysKeys.Sounds,
      HotkeysKeys.Music,
      HotkeysKeys.Info,
      HotkeysKeys.Back,
    ],
    online: [
      HotkeysKeys.Mute,
      HotkeysKeys.Sounds,
      HotkeysKeys.Music,
      HotkeysKeys.Info,
      HotkeysKeys.Back,
    ],
  },
};

export default INFO_POPUP;
