import { Language } from 'common/types/enums';

export const NEXT_LANG = {
  eng: Language.Ru,
  ru: Language.Eng,
};

const LANGUAGE = {
  popup: {
    auth: {
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
    },
    room: {
      createRoom: {
        eng: 'Create Room',
        ru: 'Создать комнату',
      },
      getInRoom: {
        eng: 'Get in Room',
        ru: 'Войти в комнату',
      },
      randomRoom: {
        eng: 'Get in Random Room',
        ru: 'Cлучайная комната',
      },
      message: {
        eng: 'Enter a name and create a room or enter an existing room by name',
        ru: 'Введите название и создайте комнату или войдите в существующую комнату по имени',
      },
    },
    popupInputs: {
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
      room: {
        placeholder: {
          eng: 'Input room name',
          ru: 'Введите название комнаты',
        },
        hint: {
          eng: 'Length must be at least 6 characters',
          ru: 'Длина должна быть не менее 6 символов',
        },
      },
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
        room: {
          eng: 'Name should not be empty',
          ru: 'Название не должно быть пустым',
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
        room: {
          eng: 'Name length must be at least 6 characters',
          ru: 'Длина названия должна быть не менее 6 символов',
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
    valid: {
      eng: 'Valid format',
      ru: 'Правильный формат',
    },
    socketErrors: {
      alreadyExists: {
        eng: 'Room with this name already exists',
        ru: 'Комната с таким именем уже существует',
      },
      notExists: {
        eng: 'Room with this name does not exist',
        ru: 'Комната с таким именем не существует',
      },
      isFull: {
        eng: 'Room is full',
        ru: 'Комната уже заполнена',
      },
      somethingWrong: {
        eng: 'Something went wrong you are alone in the room',
        ru: 'Что-то пошло не так, вы один в комнате',
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
    twoPlayersGame: {
      eng: 'Two Players',
      ru: 'Игра для двоих',
    },
    onlineGame: {
      eng: 'Online Game',
      ru: 'Играть онлайн',
    },
    localGame: {
      eng: 'Local Game',
      ru: 'Играть локально',
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
  multiplayerScene: {
    waitMessage: {
      eng: 'Waiting for second player...',
      ru: 'Ожидаем второго игрока...',
    },
  },
  winPopup: {
    congrats: {
      eng: 'Congratulations!',
      ru: 'Поздравляем!',
    },
    multiplayWinMessage: {
      eng: 'The winner is Player {}',
      ru: 'Победил игрок {}',
    },
    leaveMessage: {
      eng: 'The opponent has left \nthe game.',
      ru: 'Противник покинул игру.',
    },
    singleplayWinMessage: {
      eng: "You've reached the last level. \nYour score is {} stars. \nDo you want to restart?",
      ru: 'Вы достигли последнего \nуровня. \nНабрано звёзд: {}. \nХотите начать заново?',
    },
    starSingular: {
      eng: 'star',
      ru: 'звезда',
    },
    starPlural: {
      eng: 'stars',
      ru: '',
    },
  },
};

export default LANGUAGE;
