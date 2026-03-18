# ADR-001: Dependencias Core del Backend

> **Estado:** aceptado
> **Fecha:** 2026-03-17
> **Autor:** equipo Luzentia

## Contexto

Se necesita definir el stack tecnológico para el backend de Luzentia, una API REST para una aplicación móvil de salud mental. Los requerimientos clave son: autenticación segura, validación estricta de datos, ORM con migraciones, documentación automática de API, analytics con respeto a privacidad, y health checks para monitoreo.

## Decisión

### Framework y Runtime

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **NestJS** | 11.x | Framework principal |
| **TypeScript** | 5.7.x | Lenguaje con tipado estricto |
| **Node.js** | LTS | Runtime |

### Base de Datos

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **Prisma** | 5.22.0 | ORM con migraciones y type-safety |
| **@prisma/client** | 5.22.0 | Cliente generado para queries |
| **PostgreSQL** | - | Base de datos relacional (via Docker) |

### Autenticación

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **@nestjs/jwt** | 11.x | Generación y verificación de JWT |
| **@nestjs/passport** | 11.x | Integración de estrategias de auth |
| **passport-jwt** | 4.x | Estrategia JWT para Passport |
| **bcrypt** | 6.x | Hashing de contraseñas |
| **google-auth-library** | 10.x | Verificación de tokens de Google OAuth |

### Validación

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **class-validator** | 0.14.x | Decoradores de validación en DTOs |
| **class-transformer** | 0.5.x | Transformación de objetos planos a clases |
| **joi** | 18.x | Validación de variables de entorno al arrancar |

### Documentación

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **@nestjs/swagger** | 11.x | Generación automática de OpenAPI spec |
| **swagger-ui-express** | 5.x | UI interactiva en `/docs` |

### HTTP y Comunicación

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **@nestjs/axios** | 4.x | Cliente HTTP para llamadas a APIs externas |
| **axios** | 1.x | HTTP client subyacente |
| **rxjs** | 7.x | Programación reactiva (requerido por NestJS) |

### Observabilidad

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **posthog-node** | 5.x | Analytics y feature flags |
| **@nestjs/terminus** | 11.x | Health checks (DB + memoria) |

### Infraestructura

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **reflect-metadata** | 0.2.x | Metadatos para decoradores (requerido por NestJS) |

### Testing (devDependencies)

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **jest** | 30.x | Framework de testing |
| **ts-jest** | 29.x | Transform de TypeScript para Jest |
| **supertest** | 7.x | Testing HTTP para E2E |
| **@nestjs/testing** | 11.x | Utilidades de testing de NestJS |

### Code Quality (devDependencies)

| Dependencia | Versión | Rol |
|-------------|---------|-----|
| **eslint** | 9.x | Linter |
| **prettier** | 3.x | Formatter |
| **typescript-eslint** | 8.x | Reglas ESLint para TypeScript |
| **eslint-config-prettier** | 10.x | Desactiva reglas de ESLint que chocan con Prettier |
| **eslint-plugin-prettier** | 5.x | Ejecuta Prettier como regla de ESLint |

## Alternativas Consideradas

### ORM: TypeORM en lugar de Prisma

- **Pros:** Más maduro, decoradores nativos, migrations robustas
- **Contras:** API más verbosa, menos type-safety, schema definido en clases (mezcla modelo con lógica)
- **Razón de descarte:** Prisma ofrece mejor DX con schema declarativo, cliente tipado auto-generado, y migraciones más predecibles. TypeORM tiende a bugs sutiles con relaciones complejas y lazy loading.

### ORM: Drizzle en lugar de Prisma

- **Pros:** Más ligero, queries más cercanas a SQL, mejor performance
- **Contras:** Ecosistema más joven, menos documentación, migraciones menos maduras
- **Razón de descarte:** Drizzle aún no tiene la madurez necesaria para un proyecto en producción con requerimientos de compliance (GDPR). Prisma tiene mejor soporte para migraciones controladas y audit trail.

### Auth: Firebase Auth completo en lugar de JWT propio

- **Pros:** Auth gestionado, soporte multi-proveedor out-of-the-box
- **Contras:** Vendor lock-in, latencia adicional en cada request para verificar tokens, menos control sobre claims personalizados
- **Razón de descarte:** Se necesita control total sobre el JWT payload (roles, country) y la lógica de consentimiento GDPR. Google OAuth se integra vía `google-auth-library` solo para verificar el idToken, manteniendo el JWT propio.

### Validación: zod en lugar de class-validator

- **Pros:** API funcional, mejor inferencia de tipos, schema-first
- **Contras:** No se integra nativamente con el ValidationPipe de NestJS, requiere adaptadores custom
- **Razón de descarte:** `class-validator` + `class-transformer` es el estándar de NestJS. Usar zod requeriría pipes custom y perdería la integración nativa con Swagger para generar documentación automática desde DTOs.

### Validación de env: @nestjs/config con zod en lugar de joi

- **Pros:** Misma librería que el código de negocio, mejor type inference
- **Contras:** `@nestjs/config` documenta joi como método oficial de validación
- **Razón de descarte:** Joi es la opción documentada oficialmente por NestJS para `validationSchema` en `ConfigModule.forRoot()`. Usar zod requeriría un adapter custom sin beneficio real dado que la validación de env es un caso de uso simple.

### Analytics: Mixpanel o Amplitude en lugar de PostHog

- **Pros:** Más features enterprise, mejores funnels/retention charts
- **Contras:** Más caros, SDKs más pesados, datos en servidores de terceros
- **Razón de descarte:** PostHog ofrece feature flags + analytics en una sola herramienta, es open-source (posibilidad de self-host futuro), y su SDK de Node es ligero. Para una app de salud mental, minimizar terceros con acceso a datos de usuarios es prioritario.

### Testing: Vitest en lugar de Jest

- **Pros:** Más rápido, mejor soporte de ESM, configuración más simple
- **Contras:** Menos integración con el ecosistema NestJS, `@nestjs/testing` asume Jest
- **Razón de descarte:** NestJS genera proyectos con Jest por defecto y `@nestjs/testing` está optimizado para Jest. Migrar a Vitest introduciría fricción sin beneficio significativo en un backend donde los tests no son pesados en transpilación.

## Consecuencias

- El stack está atado al ecosistema NestJS — cambiar de framework implicaría reescribir guards, pipes, decoradores y modules
- Prisma requiere regenerar el cliente después de cada cambio al schema (`npx prisma generate`)
- Las versiones de Prisma client y CLI deben mantenerse sincronizadas (ambas en 5.22.0)
- PostHog como servicio externo es un punto de fallo — el código maneja gracefully si no está configurado
- `class-validator` obliga a usar clases para DTOs (no interfaces ni tipos planos)

## Notas para la IA

> **IMPORTANTE:** Esta sección existe para que Claude (u otra IA) no re-proponga alternativas que ya fueron evaluadas y descartadas.

- **NO sugerir TypeORM** como reemplazo de Prisma — ya fue evaluado y descartado por menor type-safety y DX
- **NO sugerir Drizzle** como reemplazo de Prisma — descartado por inmadurez en migraciones y compliance
- **NO sugerir zod** para validación de DTOs — no se integra nativamente con NestJS ValidationPipe ni con Swagger
- **NO sugerir zod** para validación de env — joi es el estándar oficial de `@nestjs/config`
- **NO sugerir Firebase Auth completo** — se necesita control total del JWT y lógica GDPR
- **NO sugerir Mixpanel/Amplitude** — PostHog fue elegido por ser open-source y minimizar terceros con datos sensibles
- **NO sugerir Vitest** — `@nestjs/testing` está optimizado para Jest
- **NO sugerir migrar** fuera de NestJS — toda la arquitectura (guards, pipes, modules, decoradores) depende del framework
- **Respetar:** Las versiones de Prisma deben estar sincronizadas (client = CLI = 5.22.0)
- **Respetar:** DTOs siempre como clases con `class-validator`, nunca interfaces
- **Si se necesita agregar una dependencia nueva:** Crear un ADR separado justificando la adición
