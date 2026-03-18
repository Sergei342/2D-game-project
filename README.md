### Игра "Space Invaders"

![img.png](img.png) 

### Ссылка на демонстрационное видео 5 и 6 спринтов

С отчетом о проделанной работе можно ознакомиться по ссылке [здесь](https://disk.yandex.ru/d/pb_yjGROm1UBXw)

### Как запускать? (client)

1. Убедитесь что у вас установлены указанные в client/package.json зависимости, для установки выполните команду `yarn install`
2. Для запуска клиента выполните команду `yarn dev` либо через команду в client/package.json 

### Тесты

Для клиента используется [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

Запуск тестов для клиента - через команду в client/package.json

"test": "jest ./", - запуск тестов
"test:coverage": "jest --coverage", - запуск тестов с покрытием

(Команда ```yarn test``` запускает тесты для клиента и сервера)

### Линтинг

```yarn lint```

либо через команду в client/package.json

"lint": "eslint .",

### Форматирование prettier

```yarn format```

### Production build

```yarn build```

---------------
Внимание, данный раздел на редактировании

И чтобы посмотреть что получилось


`yarn preview --scope client`
`yarn preview --scope server`

## Хуки
В проекте используется [lefthook](https://github.com/evilmartians/lefthook)
Если очень-очень нужно пропустить проверки, используйте `--no-verify` (но не злоупотребляйте :)

## Ой, ничего не работает :(

Откройте issue, я приду :)

## Автодеплой статики на vercel
Зарегистрируйте аккаунт на [vercel](https://vercel.com/)
Следуйте [инструкции](https://vitejs.dev/guide/static-deploy.html#vercel-for-git)
В качестве `root directory` укажите `packages/client`

Все ваши PR будут автоматически деплоиться на vercel. URL вам предоставит деплоящий бот

## Production окружение в докере
Перед первым запуском выполните `node init.js`


`docker compose up` - запустит три сервиса
1. nginx, раздающий клиентскую статику (client)
2. node, ваш сервер (server)
3. postgres, вашу базу данных (postgres)

Если вам понадобится только один сервис, просто уточните какой в команде
`docker compose up {sevice_name}`, например `docker compose up server`