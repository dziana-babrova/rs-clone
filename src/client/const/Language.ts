export enum Language {
  Eng = 'eng',
  Ru = 'ru',
}

export const NEXT_LANG = {
  eng: Language.Ru,
  ru: Language.Eng,
};

const LANGUAGE = {
  authPopup: {
    signIn: {
      submitBtn: {
        eng: 'Sign In',
        ru: 'Войти',
      },
      message: {
        eng: 'Do not have an account?',
        ru: 'У вас нет аккаунта?',
      },
    },
    signUp: {
      submitBtn: {
        eng: 'Sign Up',
        ru: 'Зарегистрироваться',
      },
      message: {
        eng: 'Do you already have an account?',
        ru: 'У вас уже есть аккаунт?',
      },
    },
    valid: {
      eng: 'Valid format',
      ru: 'Правильный формат',
    },
    errors: {
      emptyError: {
        email: {
          eng: 'Email should not be empty',
          ru: 'Электронная почта не должна быть пустой',
        },
        password: {
          eng: 'Password should not be empty',
          ru: 'Пароль не должен быть пустым',
        },
        username: {
          eng: 'Username should not be empty',
          ru: 'Имя не должен быть пустым',
        },
      },
      lengthError: {
        email: {
          eng: 'Email length must be at least 3 characters',
          ru: 'Длина почты должна быть не менее 3 символов',
        },
        password: {
          eng: 'Password length must be at least 6 characters',
          ru: 'Длина пароля должна быть не менее 6 символов',
        },
        username: {
          eng: 'Username length must be at least 3 characters',
          ru: 'Длина имени должна быть не менее 3 символов',
        },
      },
      notFoundError: {
        eng: 'User with this email was not found',
        ru: 'Пользователь с таким адресом не найден',
      },
      passwordError: {
        eng: 'Wrong password',
        ru: 'Неправильный пароль',
      },
      existError: {
        eng: 'User with this email already exists',
        ru: 'Пользователь с таким адресом уже существует',
      },
      emailPattern: {
        eng: 'Email must match the pattern',
        ru: 'Почта должна соответствовать шаблону',
      },
      passwordString: {
        eng: 'Password should be string',
        ru: 'Пароль должен быть строкой',
      },
    },
    email: {
      placeholder: {
        eng: 'Input e-mail',
        ru: 'Введите e-mail',
      },
      hint: {
        eng: 'Should match the format: mail@example.com',
        ru: 'Формат: mail@example.com',
      },
    },
    username: {
      placeholder: {
        eng: 'Input nickname',
        ru: 'Введите имя',
      },
      hint: {
        eng: 'Length must be at least 3 characters',
        ru: 'Длина должна быть не менее 3 символов',
      },
    },
    password: {
      placeholder: {
        eng: 'Input password',
        ru: 'Введите пароль',
      },
      hint: {
        eng: 'Length must be at least 6 characters',
        ru: 'Длина должна быть не менее 6 символов',
      },
    },
  },
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
      ru: 'Oдиночная игра',
    },
    onlineGame: {
      eng: 'Online Game',
      ru: 'Онлайн игра',
    },
    signIn: {
      eng: 'Sign In',
      ru: 'Войти',
    },
    logout: {
      eng: 'Logout',
      ru: 'Выйти',
    },
    levels: {
      eng: 'Levels',
      ru: 'Уровни',
    },
    landscape: {
      eng: 'Landscape',
      ru: 'Фон для игры',
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
      eng: 'Level completed!',
      ru: 'Уровень пройден!',
    },
  },
  popup: {
    congrats: {
      eng: 'Congratulations!',
      ru: 'Поздравляем!',
    },
    multiplayWinMessage: {
      eng: 'The winner is Player',
      ru: 'Победил игрок',
    },
  },
};

export default LANGUAGE;
