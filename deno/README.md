# Despliegue del Bot de Telegram SMS en Deno Deploy

Este directorio contiene los archivos necesarios para desplegar el Bot de Telegram SMS en [Deno Deploy](https://deno.com/deploy), un servicio gratuito para alojar aplicaciones Deno.

## Requisitos previos

1. Una cuenta en [Deno Deploy](https://deno.com/deploy) (puedes registrarte con GitHub)
2. Configuración completa de Telegram Bot, Supabase y Twilio (ver documentación principal)

## Estructura de archivos

- `main.ts`: Punto de entrada de la aplicación para Deno Deploy
- `deno.json`: Configuración del proyecto Deno
- `services/`: Servicios adaptados para Deno
  - `sms.ts`: Servicio para enviar SMS con Twilio
  - `supabase.ts`: Servicio para interactuar con Supabase
- `utils/`: Utilidades
  - `auth.ts`: Funciones de autenticación

## Pasos para el despliegue

### 1. Crear un nuevo proyecto en Deno Deploy

1. Inicia sesión en [Deno Deploy](https://dash.deno.com/)
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub"
4. Conecta tu cuenta de GitHub y selecciona el repositorio

### 2. Configurar variables de entorno

En la configuración del proyecto en Deno Deploy, añade las siguientes variables de entorno:

- `TELEGRAM_BOT_TOKEN`: Token de tu bot de Telegram
- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_KEY`: Clave anónima de Supabase
- `TWILIO_ACCOUNT_SID`: SID de tu cuenta de Twilio
- `TWILIO_AUTH_TOKEN`: Token de autenticación de Twilio
- `TWILIO_PHONE_NUMBER`: Número de teléfono de Twilio

### 3. Configurar el webhook de Telegram

Una vez desplegada la aplicación, necesitas configurar el webhook de Telegram para que envíe las actualizaciones a tu aplicación en Deno Deploy. Usa la siguiente URL:

```
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<TU_APP>.deno.dev/<TELEGRAM_BOT_TOKEN>
```

Reemplaza:
- `<TELEGRAM_BOT_TOKEN>` con tu token de bot
- `<TU_APP>` con el nombre de tu aplicación en Deno Deploy

## Desarrollo local

Para probar la aplicación localmente antes de desplegarla:

1. Instala Deno: [https://deno.land/manual/getting_started/installation](https://deno.land/manual/getting_started/installation)
2. Crea un archivo `.env` en el directorio `deno/` con las variables de entorno necesarias
3. Ejecuta el siguiente comando desde el directorio `deno/`:

```bash
deno task start
```

## Notas importantes

- La aplicación en Deno Deploy usa webhooks en lugar de polling, lo que es más eficiente para un entorno serverless
- Deno Deploy tiene un plan gratuito generoso que debería ser suficiente para un uso moderado del bot
- Para más información sobre los límites del plan gratuito, consulta la [documentación oficial de Deno Deploy](https://deno.com/deploy/pricing)