# Configuración de Supabase para el Bot de SMS

Este documento proporciona instrucciones detalladas sobre cómo configurar Supabase para almacenar los datos de mensajes SMS enviados por el bot de Telegram.

## Paso 1: Crear una cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com/) y crea una cuenta o inicia sesión
2. Una vez dentro del dashboard, haz clic en "New Project"

## Paso 2: Configurar un nuevo proyecto

1. Selecciona una organización o crea una nueva
2. Asigna un nombre al proyecto (por ejemplo, "telegram-sms-bot")
3. Establece una contraseña segura para la base de datos
4. Selecciona la región más cercana a tus usuarios
5. Haz clic en "Create new project"

## Paso 3: Crear la tabla para almacenar mensajes SMS

1. Una vez que el proyecto esté listo, ve a la sección "Table Editor" en el menú lateral
2. Haz clic en "Create a new table"
3. Configura la tabla con los siguientes parámetros:
   - Nombre de la tabla: `sms_messages`
   - Habilita "Enable Row Level Security (RLS)"
   - Añade las siguientes columnas:

| Nombre | Tipo | Configuración |
|--------|------|---------------|
| id | uuid | primary key, default: uuid_generate_v4() |
| from_number | text | not null |
| to_number | text | not null |
| message_content | text | not null |
| status | text | not null |
| telegram_user_id | text | not null |
| sent_at | timestamptz | not null, default: now() |

4. Haz clic en "Save" para crear la tabla

Alternativamente, puedes usar el siguiente SQL para crear la tabla:

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

## Paso 4: Configurar políticas de seguridad (RLS)

1. Ve a la tabla `sms_messages`
2. Navega a la pestaña "Policies"
3. Haz clic en "Add Policy"
4. Selecciona "Create a policy from scratch"
5. Configura las siguientes políticas:

### Política para INSERT

- Nombre: `Allow inserts from authenticated service`
- Operación: `INSERT`
- Expresión de política: `true` (o puedes restringirlo según tus necesidades)

### Política para SELECT

- Nombre: `Allow users to view their own messages`
- Operación: `SELECT`
- Expresión de política: `auth.uid()::text = telegram_user_id` (si usas autenticación de Supabase) o `true` para permitir todas las lecturas desde el servicio

## Paso 5: Obtener las credenciales de API

1. Ve a la sección "Project Settings" en el menú lateral
2. Navega a la pestaña "API"
3. Copia la "URL" y la "anon key" (clave anónima)
4. Estas son las credenciales que necesitarás para configurar tu aplicación

## Paso 6: Configurar el archivo .env

1. Abre el archivo `.env` en la raíz del proyecto
2. Actualiza las siguientes variables con las credenciales obtenidas:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-anónima
```

## Paso 7: Verificar la conexión

Para verificar que la conexión con Supabase funciona correctamente:

1. Inicia tu aplicación con `npm start`
2. Envía un mensaje de prueba a través del bot
3. Verifica en el panel de Supabase, en la sección "Table Editor", que el mensaje se ha registrado correctamente en la tabla `sms_messages`

## Solución de problemas

- Si los mensajes no se registran en Supabase, verifica que las credenciales en el archivo `.env` sean correctas
- Asegúrate de que la tabla `sms_messages` tenga la estructura correcta
- Revisa los logs de la aplicación para detectar posibles errores de conexión o inserción
- Verifica que las políticas RLS no estén bloqueando las operaciones necesarias