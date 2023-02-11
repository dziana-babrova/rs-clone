import { Language } from 'types/types';
import Colors, { ColorsNumber } from './Colors';

const START_SCENE = {
  moveX: 1000,
  moveY: 500,
  logoGroup: {
    logo: {
      y: 30,
    },
    line: {
      y: 180,
      width: 400,
      height: 3,
      color: ColorsNumber.Text,
    },
    subtitle: {
      y: 195,
      text: {
        eng: 'Time to play golf',
        ru: 'Время играть в гольф',
      },
      textSize: 30,
      color: Colors.Text,
    },
  },
  btnStartSingleGame: {
    text: {
      eng: 'Single Player',
      ru: 'Игра для одного',
    },
    width: 400,
    textSize: 40,
    textColor: Colors.Text,
    bgColor: Colors.Pink,
    hoverBgColor: Colors.PinkDark,
    y: 275,
  },
  btnStartOnlineGame: {
    text: {
      eng: 'Online Game',
      ru: 'Игра для двоих',
    },
    width: 400,
    textSize: 40,
    textColor: Colors.Text,
    bgColor: Colors.Pink,
    hoverBgColor: Colors.PinkDark,
    y: 370,
  },
  btnSignIn: {
    text: {
      eng: 'Sign In',
      ru: 'Войти',
    },
    width: 200,
    textSize: 32,
    textColor: Colors.Text,
    bgColor: Colors.Blue,
    hoverBgColor: Colors.BlueDark,
    y: 40,
  },
  btnLang: {
    textura: {
      eng: 'eng',
      ru: 'ru',
    },
    nextLang: {
      eng: Language.ru,
      ru: Language.eng,
    },
    y: 60,
  },
  btnSettings: {
    type: {
      levels: 'levels',
      landscape: 'landscape',
      winners: 'winners',
      sound: 'sound',
    },
    y: 520,
    halfGap: 15,
    btnSettingsParams: {
      width: 75,
      height: 75,
      bgColor: ColorsNumber.Blue,
      hoverBgColor: ColorsNumber.BlueDark,
    },
  },
  settingsScreen: {
    title: {
      textSize: 32,
      color: Colors.Pink,
      y: 275,
    },
    line: {
      width: 400,
      height: 3,
      marginTop: 40,
    },
    moveX: 1000,
  },
  winners: {
    text: {
      eng: 'Winners',
      ru: 'Победители',
    },
  },
  landscape: {
    text: {
      eng: 'Landscape',
      ru: 'Изображения',
    },
  },
  levels: {
    text: {
      eng: 'Levels',
      ru: 'Уровни',
    },
  },
};

export default START_SCENE;
