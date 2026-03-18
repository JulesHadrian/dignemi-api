# Arquitectura — Luzentia Backend

> Generado el 2026-03-17. Basado en el código fuente real del repositorio.

---

## 1. Vista General del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTES                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐   │
│  │  App Móvil   │  │  Swagger UI │  │  Admin (futuro front)    │   │
│  │  (iOS/Android)│  │  /docs      │  │                          │   │
│  └──────┬───────┘  └──────┬──────┘  └────────────┬─────────────┘   │
└─────────┼─────────────────┼──────────────────────┼─────────────────┘
          │ HTTPS           │ HTTP (dev)           │ HTTPS
          ▼                 ▼                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     NestJS API  (v1 prefix)                         │
│                     Puerto: 3000                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Global Middleware Pipeline                                 │    │
│  │  ┌──────────┐ ┌──────────────┐ ┌──────────────────────┐   │    │
│  │  │ CORS     │→│ ValidationPipe│→│ AllExceptionsFilter  │   │    │
│  │  └──────────┘ └──────────────┘ └──────────────────────┘   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌──────┐ ┌───────┐ ┌─────────┐ ┌──────┐ ┌──────────────┐        │
│  │ Auth │ │Content│ │  Sync   │ │Admin │ │ Entitlements │        │
│  └──┬───┘ └──┬────┘ └──┬──────┘ └──┬───┘ └──────┬───────┘        │
│     │        │         │           │             │                  │
│  ┌──┴──┐ ┌──┴───┐ ┌───┴────┐ ┌───┴────┐ ┌─────┴──────┐          │
│  │Users│ │Flags │ │Consent │ │ Audit  │ │ Analytics  │          │
│  └─────┘ └──────┘ └────────┘ └────────┘ └────────────┘          │
│     + Health, Help, Privacy, Receipts                              │
└────────┬──────────────────────┬───────────────────┬────────────────┘
         │                      │                   │
         ▼                      ▼                   ▼
┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐
│   PostgreSQL    │  │    PostHog       │  │  Google OAuth   │
│   15-alpine     │  │  (Analytics +    │  │  (Verificación  │
│   Puerto: 5432  │  │   Feature Flags) │  │   de tokens)    │
│   ORM: Prisma   │  │                  │  │                 │
└─────────────────┘  └──────────────────┘  └────────────────┘
```

---

## 2. Stack Tecnológico

| Capa              | Tecnología                      | Versión  |
|-------------------|---------------------------------|----------|
| Framework         | NestJS                          | 11.0.1   |
| Lenguaje          | TypeScript                      | 5.7.3    |
| Runtime           | Node.js                         | —        |
| Base de datos     | PostgreSQL                      | 15-alpine|
| ORM               | Prisma                          | 5.22.0   |
| Autenticación     | @nestjs/jwt + passport-jwt      | —        |
| Google OAuth      | google-auth-library             | 10.6.1   |
| Hashing           | bcrypt                          | 6.0.0    |
| Validación DTOs   | class-validator + class-transformer | —    |
| Validación Env    | joi                             | 18.0.2   |
| Documentación API | @nestjs/swagger                 | 11.2.5   |
| Analytics         | posthog-node                    | 5.24.4   |
| Health Checks     | @nestjs/terminus + @nestjs/axios| —        |
| Testing           | Jest + Supertest                | 30.0.0   |
| Linter/Formatter  | ESLint 9.18 + Prettier 3.4     | —        |

---

## 3. Módulos del Sistema

```
AppModule
├── AuthModule          → Registro, login (email + Google), emisión JWT
├── UsersModule         → CRUD de perfil de usuario
├── ContentModule       → Catálogo terapéutico, CRUD de contenido, paywall
├── SyncModule          → Push/pull de datos del cliente (con consent check)
├── ConsentModule       → Gestión de permisos GDPR (analytics, sync)
├── AnalyticsModule     → Tracking de eventos vía PostHog (con consent check)
├── EntitlementsModule  → Estado de suscripción, validación de compras
├── ReceiptsModule      → Historial de recibos de compra
├── AdminModule         → Dashboard, gestión de usuarios/contenido (ADMIN only)
├── AuditModule         → Logging de acciones admin (módulo GLOBAL)
├── FlagsModule         → Feature flags vía PostHog (con fallback local)
├── HealthModule        → Health checks (DB + memoria, vía Terminus)
├── PrivacyModule       → Exportación y eliminación de datos (GDPR)
└── HelpModule          → Recursos de ayuda geolocalizada por país
```

**Total: 14 módulos** — Cada uno sigue el patrón Controller → Service → Module con DTOs validados.

---

## 4. Flujo de Autenticación

### 4.1 Estrategia JWT

```
┌─────────┐    POST /v1/auth/login     ┌──────────┐
│ Cliente  │ ──────────────────────────→│ AuthService│
│          │   { email, password }      │           │
│          │                            │ 1. Busca user por email
│          │                            │ 2. Verifica deletedAt == null
│          │                            │ 3. bcrypt.compare(password, hash)
│          │                            │ 4. Firma JWT (7 días)
│          │   { access_token, user }   │           │
│          │ ←──────────────────────────│           │
└─────────┘                            └──────────┘
```

### 4.2 Payload del JWT

```typescript
{
  email: string,
  sub: string,           // userId (UUID)
  role: "USER" | "ADMIN",
  country?: string,
  iat: number,
  exp: number            // 7 días desde emisión
}
```

### 4.3 Tres métodos de autenticación

| Método | Endpoint | Flujo |
|--------|----------|-------|
| **Email/Password Register** | `POST /v1/auth/register` | Valida email único → bcrypt hash (10 rounds) → crea User → emite JWT |
| **Email/Password Login** | `POST /v1/auth/login` | Busca por email → verifica soft delete → compara hash → emite JWT |
| **Google OAuth** | `POST /v1/auth/google` | Verifica ID token con `google-auth-library` (OAuth2Client) → find-or-create User → emite JWT |

### 4.4 Protección de rutas

- **JwtAuthGuard** (`AuthGuard('jwt')`) — Todas las rutas excepto: `/auth/register`, `/auth/login`, `/auth/google`, `/health`
- **RolesGuard** + `@Roles('ADMIN')` — Rutas admin (`/admin/*`, `POST /help`, `DELETE /help/:id`)
- **No hay refresh tokens** — El token expira a los 7 días y el cliente debe re-autenticarse

---

## 5. Flujos de Datos Principales

### 5.1 Registro de Usuario

```
Cliente                         API                              PostgreSQL
  │                              │                                   │
  │  POST /v1/auth/register      │                                   │
  │  { email, password, name? }  │                                   │
  │ ────────────────────────────→│                                   │
  │                              │  findUnique({ email })            │
  │                              │ ─────────────────────────────────→│
  │                              │  null (no existe)                 │
  │                              │ ←─────────────────────────────────│
  │                              │                                   │
  │                              │  bcrypt.hash(password, 10)        │
  │                              │                                   │
  │                              │  create({ email, passwordHash })  │
  │                              │ ─────────────────────────────────→│
  │                              │  User creado                      │
  │                              │ ←─────────────────────────────────│
  │                              │                                   │
  │                              │  jwt.sign({ sub, email, role })   │
  │  { access_token, user }      │                                   │
  │ ←────────────────────────────│                                   │
```

### 5.2 Acceso a Contenido Premium

```
Cliente                       API                                PostgreSQL
  │                            │                                     │
  │  GET /v1/content/items/:id │                                     │
  │  Authorization: Bearer JWT │                                     │
  │ ──────────────────────────→│                                     │
  │                            │  1. JwtAuthGuard valida token       │
  │                            │                                     │
  │                            │  findUnique({ id }) → ContentItem   │
  │                            │ ───────────────────────────────────→│
  │                            │ ←───────────────────────────────────│
  │                            │                                     │
  │                            │  if (item.isPremium) {              │
  │                            │    findUnique({ userId })           │
  │                            │    → SubscriptionEntitlement        │
  │                            │ ───────────────────────────────────→│
  │                            │ ←───────────────────────────────────│
  │                            │    check status ∈ {ACTIVE, TRIAL}  │
  │                            │    && expiresAt > now()             │
  │                            │  }                                  │
  │                            │                                     │
  │  200: ContentItem          │  (o 403 si no tiene acceso premium) │
  │ ←──────────────────────────│                                     │
```

### 5.3 Sincronización de Datos (Push)

```
Cliente                       API                                PostgreSQL
  │                            │                                     │
  │  POST /v1/sync/push        │                                     │
  │  { changes: [              │                                     │
  │    { entityType, entityId, │                                     │
  │      data, deviceUpdatedAt,│                                     │
  │      isDeleted }           │                                     │
  │  ]}                        │                                     │
  │ ──────────────────────────→│                                     │
  │                            │  ConsentService.getConsent(userId)  │
  │                            │ ───────────────────────────────────→│
  │                            │  { sync: true/false }               │
  │                            │ ←───────────────────────────────────│
  │                            │                                     │
  │                            │  if (!sync) → 403 Forbidden        │
  │                            │                                     │
  │                            │  Para cada change:                  │
  │                            │    upsert on (userId+entityType+    │
  │                            │              entityId)              │
  │                            │ ───────────────────────────────────→│
  │                            │ ←───────────────────────────────────│
  │                            │                                     │
  │  200: { synced: N }        │                                     │
  │ ←──────────────────────────│                                     │
```

### 5.4 Validación de Compra (Suscripción)

```
Cliente                       API                                 PostgreSQL
  │                            │                                      │
  │  POST /v1/entitlements/    │                                      │
  │    purchase/validate       │                                      │
  │  { platform, receipt,      │                                      │
  │    productId,              │                                      │
  │    transactionId }         │                                      │
  │ ──────────────────────────→│                                      │
  │                            │  Valida recibo (mock para MVP)       │
  │                            │  [VERIFICAR: integración real con    │
  │                            │   Apple/Google aún no implementada]  │
  │                            │                                      │
  │                            │  Crea PurchaseReceipt                │
  │                            │ ────────────────────────────────────→│
  │                            │                                      │
  │                            │  Upsert SubscriptionEntitlement      │
  │                            │  status=ACTIVE, expiresAt=+30 días  │
  │                            │ ────────────────────────────────────→│
  │                            │                                      │
  │  200: { entitlement }      │                                      │
  │ ←──────────────────────────│                                      │
```

### 5.5 Tracking de Analytics (con Consent)

```
Cliente                       API                      PostHog
  │                            │                          │
  │  POST /v1/analytics/track  │                          │
  │  { event, properties }     │                          │
  │ ──────────────────────────→│                          │
  │                            │  getConsent(userId)      │
  │                            │  → analytics: true/false │
  │                            │                          │
  │                            │  if (!analytics)         │
  │                            │    return { skipped }    │
  │                            │                          │
  │                            │  Sanitiza properties     │
  │                            │  (elimina email,         │
  │                            │   password,              │
  │                            │   diary_content)         │
  │                            │                          │
  │                            │  posthog.capture()       │
  │                            │ ────────────────────────→│
  │                            │                          │
  │  200: { tracked }          │                          │
  │ ←──────────────────────────│                          │
```

---

## 6. Modelo de Datos (ER Simplificado)

```
┌──────────────────────┐
│        User          │
│──────────────────────│
│ id          (UUID PK)│
│ email       (unique) │
│ passwordHash?        │
│ name?                │
│ avatarUrl?           │
│ role        (enum)   │◄─────── Role: USER | ADMIN
│ locale               │
│ country?             │
│ timezone?            │
│ profile?    (JSON)   │
│ deletedAt?           │ ◄── Soft delete (GDPR)
│ createdAt            │
│ updatedAt            │
└──────┬───┬───┬───────┘
       │   │   │
       │   │   │  1:1
       │   │   └──────────────┐
       │   │                  ▼
       │   │  1:1    ┌─────────────────────────┐
       │   └────────→│ SubscriptionEntitlement  │
       │             │─────────────────────────│
       │             │ status (FREE|ACTIVE|    │
       │             │         EXPIRED|TRIAL)  │
       │             │ platform? (apple|google)│
       │             │ productId?              │
       │             │ expiresAt?              │
       │             └─────────────────────────┘
       │
       │  1:1        ┌──────────────────┐
       ├────────────→│     Consent      │
       │             │──────────────────│
       │             │ analytics (bool) │ ◄── Privacy-by-default: false
       │             │ sync      (bool) │ ◄── Privacy-by-default: false
       │             │ policyVersion    │
       │             └──────────────────┘
       │
       │  1:N        ┌──────────────────────────┐
       └────────────→│      SyncRecord          │
                     │──────────────────────────│
                     │ entityType               │
                     │ entityId                 │
                     │ data          (JSON)     │ ◄── Cifrado por el cliente
                     │ deviceUpdatedAt          │
                     │ serverUpdatedAt          │
                     │ isDeleted     (tombstone)│
                     │ @@unique(userId,         │
                     │   entityType, entityId)  │
                     └──────────────────────────┘

┌───────────────────────────┐    ┌──────────────────────────┐
│     ContentItem           │    │    PurchaseReceipt       │
│───────────────────────────│    │──────────────────────────│
│ type (route|day|exercise| │    │ userId                   │
│       article)            │    │ platform                 │
│ title                     │    │ transactionId            │
│ description?              │    │ productId                │
│ topic?                    │    │ rawReceipt    (Text)     │
│ locale                    │    │ status (VALID|INVALID)   │
│ version                   │    │ validatedAt              │
│ isPublished               │    └──────────────────────────┘
│ isPremium                 │
│ body          (JSON)      │    ┌──────────────────────────┐
│ sources[]                 │    │    HelpResource          │
│ disclaimerId?             │    │──────────────────────────│
└───────────────────────────┘    │ country (ISO|GLOBAL)     │
                                 │ name                     │
┌───────────────────────────┐    │ phoneNumber?             │
│      AuditLog             │    │ websiteUrl?              │
│───────────────────────────│    │ isEmergency              │
│ adminId                   │    └──────────────────────────┘
│ action                    │
│ targetId?                 │
│ details?                  │
└───────────────────────────┘
```

**Relaciones con CASCADE:** Consent, SubscriptionEntitlement y SyncRecord se eliminan automáticamente al borrar un User.

**Nota:** PurchaseReceipt **no** tiene relación FK con User en el schema de Prisma (solo almacena `userId` como string). [VERIFICAR: ¿debería tener `@relation` con User?]

---

## 7. Servicios Externos

| Servicio | Propósito | Módulo que lo consume | Configuración |
|----------|-----------|----------------------|---------------|
| **PostgreSQL 15** | Base de datos principal | PrismaService (global) | `DATABASE_URL` env var |
| **PostHog** | Analytics de eventos + feature flags | AnalyticsModule, FlagsModule | `POSTHOG_API_KEY`, `POSTHOG_HOST` |
| **Google OAuth** | Verificación de tokens de Google Sign-In | AuthModule | `GOOGLE_CLIENT_ID` |
| **Apple App Store** | Validación de recibos de compra | EntitlementsModule | [VERIFICAR: aún es mock, no hay integración real] |
| **Google Play** | Validación de recibos de compra | EntitlementsModule | [VERIFICAR: aún es mock, no hay integración real] |

---

## 8. Pipeline de Request Global

Cada request HTTP pasa por esta cadena antes de llegar al controller:

```
Request entrante
       │
       ▼
  ┌─────────┐
  │  CORS   │  app.enableCors() — sin origins configurados [VERIFICAR: configurar para producción]
  └────┬────┘
       ▼
  ┌──────────────────────┐
  │  URI Versioning (v1) │  app.setGlobalPrefix('v1')
  └──────────┬───────────┘
             ▼
  ┌──────────────────────┐
  │   ValidationPipe     │  whitelist: true, forbidNonWhitelisted: true, transform: true
  └──────────┬───────────┘
             ▼
  ┌──────────────────────┐
  │  JwtAuthGuard        │  (en rutas protegidas — verifica Bearer token)
  └──────────┬───────────┘
             ▼
  ┌──────────────────────┐
  │  RolesGuard          │  (en rutas admin — verifica role del JWT)
  └──────────┬───────────┘
             ▼
  ┌──────────────────────┐
  │  Controller Method   │
  └──────────┬───────────┘
             ▼
  ┌──────────────────────┐
  │ AllExceptionsFilter  │  Captura excepciones → { statusCode, timestamp, path, error }
  └──────────────────────┘
```

---

## 9. Variables de Entorno

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `NODE_ENV` | Sí | Entorno de ejecución | `development` \| `production` |
| `PORT` | Sí | Puerto del servidor | `3000` |
| `DATABASE_URL` | Sí | Conexión a PostgreSQL | `postgresql://user:password@localhost:5432/luzentia_db?schema=public` |
| `JWT_SECRET` | Sí | Clave para firmar tokens JWT | (secreto) |
| `GOOGLE_CLIENT_ID` | Sí | Client ID de Google OAuth | `658315...apps.googleusercontent.com` |
| `POSTHOG_API_KEY` | No | API key de PostHog | (vacío en dev = analytics deshabilitado) |
| `POSTHOG_HOST` | No | Host de PostHog | `https://app.posthog.com` |

Validación: Esquema Joi en `src/config/env.validation.ts`.

---

## 10. Entornos

| Entorno | URL Base | Swagger | Notas |
|---------|----------|---------|-------|
| **Local (dev)** | `http://localhost:3000/v1` | `/docs` habilitado | Docker Compose para PostgreSQL |
| **Producción** | [VERIFICAR: no hay URL de producción en el código] | Deshabilitado (`NODE_ENV=production`) | CORS debe configurarse con origins específicos |

---

## 11. Decoradores y Guards Personalizados

| Nombre | Tipo | Ubicación | Propósito |
|--------|------|-----------|-----------|
| `@CurrentUser()` | Param Decorator | `src/common/decorators/current-user.decorator.ts` | Extrae `req.user` (AuthUser) del request |
| `@Roles(...roles)` | Method Decorator | `src/common/decorators/roles.decorator.ts` | Define roles requeridos via `SetMetadata` |
| `RolesGuard` | Guard | `src/common/guards/roles.guard.ts` | Lee metadata de `@Roles()`, compara con `req.user.role` |
| `AllExceptionsFilter` | Exception Filter | `src/common/filters/http-exception.filter.ts` | Formato uniforme de errores en toda la API |

---

## 12. Checklist de Seguridad

| Control | Estado | Notas |
|---------|--------|-------|
| JWT en todas las rutas protegidas | ✅ Implementado | Solo 4 endpoints públicos |
| Hashing de contraseñas (bcrypt) | ✅ Implementado | Salt rounds: 10 |
| Validación estricta de inputs (DTOs) | ✅ Implementado | whitelist + forbidNonWhitelisted |
| RBAC (roles USER/ADMIN) | ✅ Implementado | RolesGuard + @Roles decorator |
| Soft deletes (GDPR) | ✅ Implementado | campo `deletedAt` en User |
| Exportación de datos (GDPR) | ✅ Implementado | GET /privacy/export |
| Eliminación de cuenta (GDPR) | ✅ Implementado | DELETE /privacy/delete |
| Consentimientos (analytics/sync) | ✅ Implementado | Privacy-by-default (false) |
| Audit logs de admin | ✅ Implementado | Fire-and-forget en AuditModule |
| Sanitización de datos en analytics | ✅ Implementado | Elimina email, password, diary_content |
| CORS restrictivo en producción | ⚠️ Pendiente | `enableCors()` sin origins específicos |
| Rate limiting | ❌ No implementado | Sin throttling en ningún endpoint |
| Helmet (headers de seguridad) | ❌ No implementado | No hay `helmet` en dependencias |
| HTTPS forzado | ❌ No implementado | Depende del deployment (reverse proxy) |
| Refresh tokens | ❌ No implementado | Solo access token con 7 días de expiración |
| Validación real de recibos (stores) | ❌ No implementado | Mock validation en EntitlementsService |
| Tests de seguridad | ❌ No implementado | Cobertura mínima (solo app.controller.spec.ts) |

---

## 13. Decisiones Arquitectónicas

Las decisiones formales se documentan en [`docs/decisions/`](decisions/).

**ADRs activos:**
- [ADR-001: Dependencias Core](decisions/001-dependencias-core.md) — Stack, ORM, auth, validación, analytics, testing

**Decisiones implícitas observadas en el código:**
- **Sin microservicios**: Monolito modular NestJS — adecuado para la fase actual (MVP)
- **Sin caché**: No hay Redis ni capa de caché — las queries van directo a PostgreSQL
- **Sin colas**: No hay workers ni jobs asíncronos — todo se procesa en el request cycle (excepto audit logs fire-and-forget)
- **Sin WebSockets**: Comunicación exclusivamente REST
- **Datos cifrados por el cliente**: SyncRecord.data se asume cifrado antes de llegar al servidor
- **Migración reciente**: Auth migró de Magic Links a JWT+bcrypt+Google OAuth (commit `ba03e55`)
