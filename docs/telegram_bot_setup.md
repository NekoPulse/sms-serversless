# Configuración del Bot de Telegram con BotFather

Este documento proporciona instrucciones detalladas sobre cómo crear y configurar un bot de Telegram utilizando BotFather.

## Paso 1: Acceder a BotFather

1. Abre la aplicación de Telegram
2. Busca "@BotFather" o accede directamente a [t.me/botfather](https://t.me/botfather)
3. Inicia una conversación con BotFather haciendo clic en "Start" o enviando el comando `/start`

## Paso 2: Crear un nuevo bot

1. Envía el comando `/newbot` a BotFather
2. BotFather te pedirá un nombre para tu bot. Este es el nombre que verán los usuarios (por ejemplo, "SMS Sender Bot")
3. Luego, BotFather te pedirá un nombre de usuario para tu bot. Este debe terminar en "bot" (por ejemplo, "sms_sender_bot")
4. Si el nombre de usuario está disponible, BotFather te proporcionará un token de acceso. **Guarda este token de forma segura**, lo necesitarás para configurar tu aplicación

## Paso 3: Configurar el bot (opcional)

### Establecer una descripción

1. Envía el comando `/setdescription` a BotFather
2. Selecciona tu bot de la lista
3. Envía una descripción detallada de lo que hace tu bot (por ejemplo, "Bot para enviar SMS a números telefónicos a través de Supabase y Twilio")

### Establecer una imagen de perfil

1. Envía el comando `/setuserpic` a BotFather
2. Selecciona tu bot de la lista
3. Envía una imagen cuadrada para usar como foto de perfil del bot

### Establecer comandos

1. Envía el comando `/setcommands` a BotFather
2. Selecciona tu bot de la lista
3. Envía la lista de comandos con sus descripciones en el siguiente formato:

```
start - Inicia el bot
help - Muestra la ayuda disponible
sms - Envía un SMS (formato: /sms +número mensaje)
history - Muestra el historial de mensajes enviados
```

## Paso 4: Configurar el archivo .env

## Paso 5: Configurar el archivo .env

1. Abre el archivo `.env` en la raíz del proyecto
2. Actualiza la variable `TELEGRAM_BOT_TOKEN` con el token proporcionado por BotFather

Ejemplo:

```
TELEGRAM_BOT_TOKEN=1234567890:ABCDefGhIJKlmnOPQrsTUVwxyZ
```

## Paso 6: Probar el bot

1. Inicia tu aplicación con `npm start`
2. Abre Telegram y busca tu bot por su nombre de usuario
3. Envía el comando `/start` para verificar que el bot responde correctamente

## Solución de problemas

- Si el bot no responde, verifica que el token en el archivo `.env` sea correcto
- Revisa los logs de la aplicación para detectar posibles errores