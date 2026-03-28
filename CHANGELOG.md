# Changelog — Luzentia Backend

> Cada entrada incluye **Notas para la IA** con contexto sobre el impacto del cambio.
> Esto permite que Claude:
> - Entienda por qué algo está como está
> - Sepa qué otros módulos se vieron afectados
> - No repita errores o decisiones ya revertidas

---

## [0.0.3] — 2026-03-27

### Añadido

#### Seeds de ejercicios terapéuticos para ansiedad
Se añadieron 9 ejercicios de tipo `exercise` al array `CONTENT_SEEDS` en `src/seeder/content-seeds.ts`, todos vinculados al tema de ansiedad. 8 recomendados según puntuaciones del GAD-2 y 1 según GAD-7.

**Seeds añadidos:**
| ID | Categoría | Prioridad GAD-2 |
|----|-----------|-----------------|
| `seed-respiracion-diafragmatica` | breathing | 0–2: P1, 3–6: P1 |
| `seed-mindfulness-respiratorio-breve` | mindfulness | 0–2: P2 |
| `seed-caminata-consciente` | movement | 0–2: P3 |
| `seed-relajacion-nocturna-breve` | relaxation | 0–2: P4 |
| `seed-relajacion-muscular-progresiva` | relaxation | 3–6: P2 |
| `seed-visualizacion-lugar-seguro` | imagery | 3–6: P3 |
| `seed-tiempo-de-preocupacion` | cognitive | 3–6: P4 |
| `seed-resolucion-de-problemas-basica` | cognitive_behavioral | 3–6: P5 |
| `seed-facing-fears-exposicion-gradual` | behavioral | GAD-7 5–9: P6, 10–14: P4 |

**Archivos modificados:**
- `src/seeder/content-seeds.ts` — se añadieron 9 objetos al array `CONTENT_SEEDS`
- `CLAUDE.md` — se actualizó la tabla de seeds actuales y descripciones del seeder
- `CHANGELOG.md` — esta entrada

> **Notas para la IA:**
> - Es la primera vez que se añaden seeds de tipo `exercise` — antes solo existían `test`
> - Los ejercicios tienen una estructura de body muy distinta a los tests: incluyen `steps`, `defaultProtocol`, `alternativeProtocols`, `guidedExperience`, `interactionModel`, `progressTracking`, `completionCriteria` y `commonDifficulties`
> - Cada ejercicio tiene un campo `recommendedFor` que lo vincula a un test (GAD-2) y rangos de puntuación con prioridad — esto permite que la app recomiende ejercicios según resultados de tamizaje
> - Los ejercicios de rango GAD-2 0–2 son preventivos/regulatorios (respiración, mindfulness, caminata, relajación nocturna); los de rango GAD-2 3–6 son para ansiedad más marcada (relajación muscular, visualización, manejo de preocupación, resolución de problemas); el ejercicio de exposición gradual se vincula al GAD-7 (rangos 5–9 y 10–14) y es el primero de dificultad `intermediate`
> - Los ejercicios se referencian entre sí en `nextStepSuggestions` — forman una red de recomendaciones cruzadas
> - Todos los ejercicios tienen `sources: []` — no incluyen referencias bibliográficas aún
> - Todos son `isPremium: false` e `isPublished: true`
> - Los IDs siguen la convención `seed-` + slug del ejercicio (ej: `seed-respiracion-diafragmatica`)

---

## [0.0.2] — 2026-03-17

### Añadido

#### Sistema de Seeds para tests psicométricos
`79163ee`, `8d7673d` — 2026-03-17

Se implementó un sistema dual de seeding para poblar la base de datos con tests psicométricos validados (GAD-2, GAD-7, PHQ-2, PHQ-9).

**Archivos creados:**
- `src/seeder/content-seeds.ts` — Fuente de verdad con los 4 tests como `ContentItem` con IDs fijos (`seed-*`)
- `src/seeder/seeder.service.ts` — Servicio que implementa `OnApplicationBootstrap` para ejecutar seeds al iniciar la app
- `src/seeder/seeder.module.ts` — Módulo importado en `AppModule`
- `prisma/seed.ts` — Script CLI para `npx prisma db seed`

**Archivos modificados:**
- `src/app.module.ts` — se importa `SeederModule`
- `package.json` — se añade config `prisma.seed` y script `deploy:migrate`
- `tsconfig.build.json` — se excluye `prisma/` del build

> **Notas para la IA:**
> - Los seeds usan **upsert idempotente** con `update: {}` — ejecutarlos múltiples veces es seguro
> - IDs fijos con prefijo `seed-` (ej: `seed-gad2`) — no usar UUIDs aleatorios para seeds
> - Hay **dos caminos** para ejecutar seeds: CLI (`npx prisma db seed`) y bootstrap (`OnApplicationBootstrap`) — ambos leen de `CONTENT_SEEDS`
> - `prisma/seed.ts` usa `require()` dinámico para importar `content-seeds` sin contaminar el build de NestJS
> - `tsconfig.build.json` excluye `prisma/` para que `prisma/seed.ts` no se compile en `dist/`
> - El tipo de contenido de los seeds es `test` (no `exercise` ni `article`) — es un tipo nuevo de `ContentItem`
> - Cada test tiene estructura completa: preguntas, opciones, scoring, interpretaciones, followUps, disclaimers y fuentes científicas
> - PHQ-9 incluye `riskFlag` en la pregunta 9 (ideación suicida) con manejo de seguridad especial

---

## [0.0.1] — 2026-02-24

### Cambiado

#### Google Login: de Firebase Admin a google-auth-library
`de813ca` — 2026-02-24

Se reemplazó `firebase-admin` por `google-auth-library` para verificar tokens de Google OAuth.

**Archivos afectados:**
- `src/auth/auth.service.ts` — usa `OAuth2Client.verifyIdToken()` en lugar de `admin.auth().verifyIdToken()`
- `src/auth/auth.module.ts` — se eliminó `OnModuleInit` y la inicialización de Firebase
- `src/config/env.validation.ts` — variable de entorno cambió de `FIREBASE_PROJECT_ID` a `GOOGLE_CLIENT_ID`
- `package.json` — se eliminó `firebase-admin`, se añadió `google-auth-library@10.x`

> **Notas para la IA:**
> - `firebase-admin` ya NO está en el proyecto — no importarlo ni sugerirlo
> - La variable de entorno es `GOOGLE_CLIENT_ID`, no `FIREBASE_PROJECT_ID`
> - `AuthModule` ya no implementa `OnModuleInit` — es un módulo simple sin lógica de inicialización
> - El motivo del cambio fue que `firebase-admin` era demasiado pesado (SDK completo de Firebase) solo para verificar un token de Google. `google-auth-library` es el cliente oficial ligero de Google

---

#### Migración de autenticación: de Magic Links a JWT con email/password
`ba03e55` — 2026-02-23

Se reescribió todo el sistema de autenticación. Se eliminaron magic links y se implementó registro/login con email+password usando JWT y bcrypt. Se añadió login con Google OAuth.

**Cambios mayores (63 archivos):**
- `src/auth/auth.service.ts` — lógica completa de register, login, googleLogin con bcrypt y JWT
- `src/auth/auth.controller.ts` — endpoints `POST /register`, `POST /login`, `POST /google`, `GET /me`
- `src/auth/dto/auth.dto.ts` — DTOs: `RegisterDto`, `LoginDto`, `GoogleLoginDto`
- `src/auth/jwt.strategy.ts` — payload ahora incluye `role` y `country`
- `prisma/schema.prisma` — se añadieron campos `passwordHash`, `name`, `avatarUrl` al modelo `User`
- Se actualizaron **todos los controllers** para usar `AuthGuard('jwt')` correctamente
- `src/common/guards/roles.guard.ts` — reescrito para leer `user.role` del JWT
- `src/common/filters/http-exception.filter.ts` — mejorado con logging diferenciado (warn vs error)

**Migraciones Prisma creadas:**
- `add_user_auth_fields` — añade `passwordHash`, `name`, `avatarUrl`
- `make_password_optional` — hace `passwordHash` opcional (para usuarios de Google que no tienen password)

> **Notas para la IA:**
> - **Magic links ya NO existen** en el proyecto — no hay ningún flujo de "enviar link por email"
> - El campo `passwordHash` es **nullable** porque los usuarios de Google no tienen password
> - Si un usuario se registró con Google e intenta hacer login con email/password, recibe `401` con mensaje "Esta cuenta fue creada con Google"
> - El JWT payload contiene `{ email, sub (userId), role, country }` — no asumir otros campos
> - `bcrypt` usa 10 salt rounds (constante `BCRYPT_SALT_ROUNDS` en `auth.service.ts`)
> - Este commit tocó 63 archivos porque fue una reescritura integral del sistema de auth que afectó a todos los módulos

---

### Añadido

#### Funcionalidad de editar contenido y campos faltantes
`9c5cf11` — 2026-02-16

Se amplió el módulo de contenido con edición y nuevos endpoints de lectura.

**Archivos afectados:**
- `src/content/content.controller.ts` — nuevos endpoints: `GET /catalog`, `GET /exercises`, `GET /routes/:id`, `GET /library`, `GET /items/:id`, `PATCH /:id`
- `src/content/content.service.ts` — lógica de validación premium, filtrado por topic/type, queries con select
- `src/content/dto/create-content.dto.ts` — campos añadidos: `sources`, `disclaimerId`, `version`, `isPremium`, `isPublished`
- `src/content/dto/update-content.dto.ts` — nuevo DTO usando `PartialType(CreateContentDto)`
- `src/common/decorators/current-user.decorator.ts` — nuevo decorador `@CurrentUser()` para extraer usuario del request
- `src/common/interfaces/auth-user.interface.ts` — interface `AuthUser` con `userId`, `email`, `role`, `country`

> **Notas para la IA:**
> - Antes de este commit, content solo tenía `POST /content` y un `GET` básico — ahora tiene 7 endpoints
> - `@CurrentUser()` es un decorador custom que extrae `req.user` — usarlo en lugar de acceder a `req.user` directamente
> - La interface `AuthUser` define el shape del usuario inyectado por JWT — es la fuente de verdad para tipar `@CurrentUser()`
> - La validación de acceso premium se hace en el **servicio**, no en el controller — patrón a seguir para lógica similar
> - `UpdateContentDto` extiende `CreateContentDto` con `PartialType` de `@nestjs/swagger` — todos los campos son opcionales

---

#### Fix menor en content controller
`ae566fe` — 2026-02-16

Corrección de un detalle en el controller de contenido (1 línea).

> **Notas para la IA:**
> - Cambio trivial, sin impacto arquitectónico

---

#### CLAUDE.md — Documentación de contexto
`feec2a3` — 2026-02-16

Se añadió `CLAUDE.md` con la documentación completa del proyecto para dar contexto a herramientas de IA.

> **Notas para la IA:**
> - `CLAUDE.md` es el archivo de referencia principal — se actualiza conforme el proyecto crece

---

### Inicial

#### API Version 1 — Setup completo del proyecto
`e15baf7` — 2026-02-06

Commit inicial con toda la estructura del backend, 14 módulos NestJS, Prisma schema con 8 modelos, Docker Compose, y configuración de linting/testing.

**Módulos creados (83 archivos):**
- `auth` — autenticación (en esta versión usaba magic links, luego reemplazado)
- `users` — gestión de perfil
- `content` — contenido terapéutico (solo crear y leer básico)
- `admin` — dashboard y gestión de usuarios/contenido
- `analytics` — tracking con PostHog
- `consent` — consentimientos GDPR
- `entitlements` — suscripciones y validación de compras
- `flags` — feature flags via PostHog
- `health` — health checks (DB + memoria)
- `help` — recursos de ayuda por país
- `privacy` — exportación y eliminación de datos (GDPR)
- `receipts` — historial de recibos
- `sync` — sincronización de datos cliente-servidor
- `audit` — logs de auditoría de admins

**Prisma migrations:**
1. `init_users` — modelo User básico
2. `add_consent` — modelo Consent (1:1 User)
3. `add_entitlements` — modelos SubscriptionEntitlement + PurchaseReceipt
4. `add_content` — modelo ContentItem
5. `add_sync` — modelo SyncRecord
6. `add_user_role` — enum Role (USER/ADMIN)
7. `add_help_resource` — modelo HelpResource
8. `add_audit_log` — modelo AuditLog
9. Ajuste de cascade deletes

**Infraestructura:**
- `docker-compose.yml` — PostgreSQL en puerto 5432
- `eslint.config.mjs` — ESLint 9 flat config
- `.prettierrc` — Prettier con singleQuote y trailing commas
- `tsconfig.json` — strict mode habilitado

> **Notas para la IA:**
> - Este commit usaba **magic links** para auth — ese sistema fue completamente reemplazado en `ba03e55`
> - El campo `passwordHash` NO existía en este commit — fue añadido después
> - El modelo `User` original solo tenía `id`, `email`, `role`, `locale`, `country`, `timezone`, `profile`, timestamps y `deletedAt`
> - `PrismaService` vive en `src/prisma.service.ts` (raíz de src), no dentro de un módulo — es un provider global
> - Las migraciones están en `prisma/migrations/` y se ejecutan con `npx prisma migrate dev`
