# Bot de Telegram para envío de SMS con Supabase

Este proyecto implementa un bot de Telegram que permite a usuarios autorizados enviar mensajes SMS a números telefónicos. El bot utiliza Supabase como base de datos para almacenar el historial de mensajes enviados.

## Características

- Envío de SMS a números telefónicos mediante comandos de Telegram
- Almacenamiento del historial de mensajes en Supabase
- Control de acceso para usuarios autorizados
- Visualización del historial de mensajes enviados

## Requisitos previos

- Node.js (v14 o superior)
- Una cuenta en [Telegram](https://telegram.org/)
- Un bot de Telegram creado con [BotFather](https://t.me/botfather)
- Una cuenta en [Supabase](https://supabase.com/)
- Una cuenta en [Twilio](https://www.twilio.com/) para el envío de SMS

## Configuración

### 1. Configurar Supabase

1. Crea una nueva base de datos en Supabase
2. Crea una tabla llamada `sms_messages` con la siguiente estructura:

```sql
create table sms_messages (
  id uuid default uuid_generate_v4() primary key,
  from_number text not null,
  to_number text not null,
  message_content text not null,
  status text not null,
  telegram_user_id text not null,
  sent_at timestamp with time zone default now() not null
);
```

### 2. Configurar Twilio

1. Regístrate en Twilio y obtén un número de teléfono para enviar SMS
2. Anota tu Account SID y Auth Token

### 3. Configurar el Bot de Telegram

1. Habla con [BotFather](https://t.me/botfather) en Telegram
2. Usa el comando `/newbot` para crear un nuevo bot
3. Sigue las instrucciones y guarda el token de acceso

### 4. Configurar el proyecto

1. Clona este repositorio
2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` basado en `.env.example` y completa las variables:

```
# Telegram Bot Token (obtenido de BotFather)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Supabase credentials
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Twilio credentials para envío de SMS
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Configuración de seguridad
# Lista de IDs de usuarios de Telegram autorizados (separados por comas)
AUTHORIZED_USERS=user_id_1,user_id_2
```

## Uso

### Iniciar el bot

```bash
npm start
```

Para desarrollo:

```bash
npm run dev
```

### Comandos del bot

- `/start` - Inicia el bot
- `/help` - Muestra la ayuda
- `/sms <número> <mensaje>` - Envía un SMS
  - Ejemplo: `/sms +123456789 Hola, ¿cómo estás?`
- `/history` - Muestra el historial de mensajes enviados

## Estructura del proyecto

```
├── src/
│   ├── config/         # Configuración
│   ├── controllers/    # Controladores
│   ├── services/       # Servicios
│   ├── utils/          # Utilidades
│   └── index.js        # Punto de entrada
├── .env.example        # Ejemplo de variables de entorno
├── package.json        # Dependencias
└── README.md           # Documentación
```

## Licencia

ISC