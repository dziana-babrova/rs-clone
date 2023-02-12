export enum Language {
  Eng = 'eng',
  Ru = 'ru',
}

export const NEXT_LANG = {
  eng: Language.Ru,
  ru: Language.Eng,
};

const LANGUAGE = {
  preloadScene: {
    title: {
      eng: 'Loading...',
      ru: 'Загрузка...',
    },
    subtitle: {
      eng: 'Loading asset:',
      ru: 'Загружаю файл:',
    },
  },
  startScene: {
    subtitle: {
      eng: 'Time to play golf',
      ru: 'Время играть в гольф',
    },
    singleGame: {
      eng: 'Single Player',
      ru: 'Игра для одного',
    },
    onlineGame: {
      eng: 'Online Game',
      ru: 'Онлайн игра',
    },
    signIn: {
      eng: 'Sign In',
      ru: 'Войти',
    },
    levels: {
      eng: 'Levels',
      ru: 'Уровни',
    },
    landscape: {
      eng: 'Landscape',
      ru: 'Изображения',
    },
    winners: {
      eng: 'Winners',
      ru: 'Победители',
    },
  },
  gameScene: {
    ball: {
      eng: 'Ready!',
      ru: 'Готов!',
    },
    level: {
      eng: 'Level',
      ru: 'Уровень',
    },
    win: {
      eng: 'Level complited!',
      ru: 'Уровень пройден!',
    },
  },
};

export default LANGUAGE;
