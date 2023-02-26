import { HotkeysKeys } from 'common/types/enums';

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
  hotkeys: {
    start: [
      HotkeysKeys.Mute,
      HotkeysKeys.Sounds,
      HotkeysKeys.Music,
      HotkeysKeys.Levels,
      HotkeysKeys.Info,
      HotkeysKeys.Restart,
      HotkeysKeys.Back,
      HotkeysKeys.Winners,
    ],
    single: [
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
  },
  about: {
    // start: {

    // },
  },
};

export default INFO_POPUP;
