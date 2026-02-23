# Автотесты для Stack-IT

Проект с автотестами для проверки раздела **«Адреса проживающих»** на демо-стенде [Stack-IT](https://demo.app.stack-it.ru/fl/).

## 🚀 Технологии

- [Playwright](https://playwright.dev/) — фреймворк для автотестов
- JavaScript — язык написания тестов
- GitHub — хранение кода

## 📋 Что проверяют тесты

| № | Тест | Описание |
|---|------|----------|
| 1 | Диалоговое окно | Открытие и закрытие диалога без сохранения |
| 2 | Создание района | Добавление нового района и проверка в таблице |
| 3 | Редактирование | Изменение названия существующего района |
| 4 | Удаление | Удаление района из таблицы |
| 5 | Пустое название | Проверка, что нельзя создать район без названия |

Все тесты **самоочищаются** — после каждого теста созданные записи удаляются.

## ⚙️ Установка и запуск

### 1. Клонировать репозиторий
```
git clone https://github.com/Neeqoo/Stack-it.git
cd Stack-it
```

### 2. Установить зависимости
```
npm install
```

### 3. Установить браузеры Playwright
```
npx playwright install chromium
```

### 4. Запустить тесты
```
npx playwright test address-fond.spec.js --headed --project=chromium
```

### 5. Посмотреть отчёт
```
npx playwright show-report
```

### 4. Локальный запуск (по одному тесту)
```
# только тест 1
npx playwright test address-fond.spec.js -g "Диалог"

# только тест 2
npx playwright test address-fond.spec.js -g "Создание"

# только тест 3
npx playwright test address-fond.spec.js -g "Редактирование"

# только тест 4
npx playwright test address-fond.spec.js -g "Удаление"

# только тест 5
npx playwright test address-fond.spec.js -g "Пустое"
```

### 📬 Контакты
По всем вопросам — tg @neeqoo
