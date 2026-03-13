export const patterns = {
  name: /^[A-ZА-ЯЁ][a-zа-яё]+(-[A-ZА-ЯЁ][a-zа-яё]+)?$/,

  login: /^(?=.*[A-Za-z])[A-Za-z0-9_-]{3,20}$/,

  email: /^[A-Za-z0-9._-]+@[A-Za-z0-9-]+\.[A-Za-z]+$/,

  password: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,

  phone: /^\+?\d{10,15}$/,
}

export const validationRules = {
  first_name: [
    { required: true, message: 'Введите имя' },
    {
      pattern: patterns.name,
      message:
        'Имя: латиница или кириллица, первая буква заглавная, без пробелов, цифр и спецсимволов (допустим дефис)',
    },
  ],

  second_name: [
    { required: true, message: 'Введите фамилию' },
    {
      pattern: patterns.name,
      message:
        'Фамилия: латиница или кириллица, первая буква заглавная, без пробелов, цифр и спецсимволов (допустим дефис)',
    },
  ],

  login: [
    { required: true, message: 'Введите логин' },
    {
      pattern: patterns.login,
      message:
        'Логин: 3–20 символов, латиница, можно цифры, дефис и нижнее подчёркивание, но не только цифры',
    },
  ],

  email: [
    { required: true, message: 'Введите email' },
    {
      pattern: patterns.email,
      message: 'Введите корректный email',
    },
  ],

  password: [
    { required: true, message: 'Введите пароль' },
    {
      pattern: patterns.password,
      message:
        'Пароль: 8–40 символов, минимум одна заглавная буква и одна цифра',
    },
  ],

  phone: [
    { required: true, message: 'Введите телефон' },
    {
      pattern: patterns.phone,
      message: 'Телефон: от 10 до 15 цифр, может начинаться с плюса',
    },
  ],
}
