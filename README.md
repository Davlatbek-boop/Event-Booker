# 🎟️ EventBooker

**EventBooker** — это система для управления и бронирования мероприятий.  
Пользователи могут регистрироваться на события, а администраторы и организаторы — создавать и управлять ими.  
Проект написан с использованием **NestJS**, **TypeORM**, **PostgreSQL** и **Nodemailer (Handlebars templates)**.

---

## 🚀 Технологии

| Технология | Назначение |
|-------------|-------------|
| **NestJS** | Backend фреймворк |
| **TypeORM** | ORM для работы с PostgreSQL |
| **PostgreSQL** | Основная база данных |
| **Nodemailer + Handlebars** | Отправка email и шаблоны писем |
| **Swagger** | Документация API |
| **JWT, AuthGuard, RolesGuard** | Аутентификация и ролевая авторизация |
| **dotenv** | Управление переменными окружения |

---

## 📂 Структура проекта

```bash
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── dto/
│   ├── guards/
│   └── decorators/
│
├── bookings/
│   ├── bookings.controller.ts
│   ├── bookings.service.ts
│   ├── dto/
│   └── entities/
│
├── events/
│   ├── events.controller.ts
│   ├── events.service.ts
│   └── entities/
│
├── mail/
│   ├── mail.service.ts
│   ├── templates/
│   │   ├── confirmation.hbs
│   │   └── sent-event.hbs
│
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── entities/
│
└── main.ts


git clone https://github.com/Davlatbek-boop/EventBooker.git
cd EventBooker
npm install


# Сервер
PORT=3000 

# Настройки базы данных PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USERNAME=postgres
PG_PASSWORD=yourpassword
PG_DB='eventspot'

# JWT (токены авторизации)
ACCESS_TOKEN_KEY=YourAccessSecretKey
ACCESS_TOKEN_TIME="15h"
REFRESH_TOKEN_KEY=YourRefreshSecretKey
REFRESH_TOKEN_TIME="15h"
REFRESH_COOKIE_TIME=1296000000

# SMTP (для отправки email уведомлений)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASSWORD=yourapppassword

# URL API (используется для Swagger и email-ссылок)
API_URL=http://localhost:3000
