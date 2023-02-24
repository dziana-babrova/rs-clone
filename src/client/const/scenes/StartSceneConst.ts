import {
  Colors, ColorsNumber, AuthFormInputsKeys, RoomFormInputsKeys,
} from 'common/types/enums';

export const START_SCENE = {
  x: -1000,
  y: -500,
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
      textSize: 30,
      color: Colors.Text,
    },
  },
  btnBase: {
    width: 400,
    textSize: 40,
    textColor: Colors.Text,
    bgColor: Colors.Pink,
    hoverBgColor: Colors.PinkDark,
    y: 275,
  },
  btnStartSingleGame: {
    width: 400,
    textSize: 40,
    textColor: Colors.Text,
    bgColor: Colors.Pink,
    hoverBgColor: Colors.PinkDark,
    y: 275,
  },
  btnStartTwoPlayersGame: {
    width: 400,
    textSize: 40,
    textColor: Colors.Text,
    bgColor: Colors.Pink,
    hoverBgColor: Colors.PinkDark,
    y: 370,
  },
  btnStartOnlineGame: {
    width: 400,
    textSize: 40,
    textColor: Colors.Text,
    bgColor: Colors.Pink,
    hoverBgColor: Colors.PinkDark,
    y: 370,
  },
  btnStartLocalGame: {
    width: 400,
    textSize: 40,
    textColor: Colors.Text,
    bgColor: Colors.Pink,
    hoverBgColor: Colors.PinkDark,
    y: 275,
  },

  btnAuth: {
    width: 200,
    textSize: 32,
    textColor: Colors.Text,
    bgColor: Colors.Blue,
    hoverBgColor: Colors.BlueDark,
    y: 40,
  },
  btnLang: {
    y: 60,
  },
  btnSettings: {
    type: {
      levels: 'levels',
      landscape: 'landscape',
      winners: 'winners',
      music: 'music',
      back: 'back',
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

  },
  landscape: {

  },
  levels: {

  },
  formInputs: {
    auth: [
      {
        name: AuthFormInputsKeys.Email,
        type: 'email',
      },
      {
        name: AuthFormInputsKeys.Username,
        type: 'text',
      },
      {
        name: AuthFormInputsKeys.Password,
        type: 'password',
      },
    ],
    room: [
      {
        name: RoomFormInputsKeys.Room,
        type: 'text',
      },
    ],
  },
};

export const START_SCENE_ANIMATION = {
  move: {
    ease: 'Back',
    duration: 1000,
  },

  scaleToOrigin: {
    ease: 'Back',
    duration: 200,
  },
};
