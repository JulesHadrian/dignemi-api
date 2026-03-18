# API Contracts — Luzentia Backend

> **Este archivo es la fuente de verdad** entre frontend (web), mobile (app) y backend.
>
> - Antes de crear un endpoint → documentarlo aquí
> - Antes de consumir un endpoint → verificar aquí
> - Si hay discrepancia entre código y contrato → **el contrato manda**

---

## Convenciones Globales

### Base URL

```
{HOST}/v1
```

### Autenticación

Todos los endpoints protegidos requieren header:

```
Authorization: Bearer <jwt_token>
```

### JWT Payload

```typescript
{
  email: string
  sub: string          // userId
  role: "USER" | "ADMIN"
  country?: string
  iat: number
  exp: number
}
```

### Formato de Error (global)

Todas las excepciones devuelven:

```json
{
  "statusCode": 409,
  "timestamp": "2026-03-17T12:00:00.000Z",
  "path": "/v1/auth/register",
  "error": "El correo electrónico ya está registrado"
}
```

### Códigos HTTP Comunes

| Código | Significado |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 204 | Eliminación exitosa (sin body) |
| 400 | Validación fallida / datos inválidos |
| 401 | Token JWT ausente o inválido |
| 403 | Sin permisos (premium, rol, consentimiento) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej: email duplicado) |

### Validación de Entrada

El backend aplica globalmente:
- `whitelist: true` — elimina propiedades desconocidas
- `forbidNonWhitelisted: true` — error 400 si envían campos extra
- `transform: true` — convierte payloads a instancias de DTOs

---

## 1. Auth

### `POST /v1/auth/register`

Registrar nuevo usuario con email y password.

**Auth:** No

**Request Body:**

```typescript
{
  email: string       // required — @IsEmail
  password: string    // required — @MinLength(8), @MaxLength(128)
  name?: string       // optional
}
```

**Response `201`:**

```typescript
{
  access_token: string
  user: {
    id: string
    email: string
    name: string | null
    avatar: string | null
  }
}
```

**Errores:**

| Código | Causa |
|--------|-------|
| 409 | Email ya registrado |

---

### `POST /v1/auth/login`

Login con email y password.

**Auth:** No

**Request Body:**

```typescript
{
  email: string       // required — @IsEmail
  password: string    // required
}
```

**Response `200`:**

```typescript
{
  access_token: string
  user: {
    id: string
    email: string
    name: string | null
    avatar: string | null
  }
}
```

**Errores:**

| Código | Causa |
|--------|-------|
| 401 | Credenciales inválidas |
| 401 | Cuenta eliminada |
| 401 | Cuenta creada con Google (debe usar `/auth/google`) |

---

### `POST /v1/auth/google`

Login/registro con Google OAuth (Firebase ID token).

**Auth:** No

**Request Body:**

```typescript
{
  idToken: string     // required — token de Firebase/Google
}
```

**Response `200`:**

```typescript
{
  access_token: string
  user: {
    id: string
    email: string
    name: string | null
    avatar: string | null
  }
}
```

**Errores:**

| Código | Causa |
|--------|-------|
| 401 | Token de Google inválido o expirado |

---

### `GET /v1/auth/me`

Obtener perfil del usuario autenticado (datos del JWT).

**Auth:** JWT

**Response `200`:**

```typescript
{
  userId: string
  email: string
  role: "USER" | "ADMIN"
  country?: string
}
```

---

## 2. Users

### `PATCH /v1/users/me`

Actualizar perfil del usuario (onboarding, preferencias de locale).

**Auth:** JWT

**Request Body:**

```typescript
{
  profile?: object    // optional — JSON libre (ej: { issues: ["stress"], experienceLevel: "beginner" })
  locale?: string     // optional — ej: "es-MX"
  country?: string    // optional — ISO 2 letras, exactamente 2 caracteres (ej: "MX")
}
```

**Response `200`:**

```typescript
{
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: "USER" | "ADMIN"
  locale: string
  country: string | null
  timezone: string | null
  profile: object | null
  createdAt: string    // ISO 8601
  updatedAt: string
  deletedAt: string | null
}
```

---

## 3. Content

### `GET /v1/content/catalog`

Catálogo de rutas terapéuticas publicadas. Filtra contenido premium según suscripción del usuario.

**Auth:** JWT

**Response `200`:**

```typescript
Array<{
  id: string
  title: string
  description: string | null
  topic: string | null
  version: number
  isPremium: boolean
}>
```

**Lógica:** Solo devuelve items con `type = "route"` y `isPublished = true`. Usuarios sin premium solo ven `isPremium: false`.

---

### `GET /v1/content/exercises`

Listar ejercicios publicados con filtro opcional por tema.

**Auth:** JWT

**Query Parameters:**

| Param | Tipo | Requerido | Ejemplo |
|-------|------|-----------|---------|
| `topic` | string | No | `ansiedad`, `sueño` |

**Response `200`:**

```typescript
Array<{
  id: string
  title: string
  description: string | null
  topic: string | null
  version: number
  isPremium: boolean
}>
```

**Lógica:** Items con `type = "exercise"`, `isPublished = true`, ordenados por `createdAt DESC`. Usuarios sin premium solo ven contenido gratuito.

---

### `GET /v1/content/routes/:id`

Detalle completo de una ruta (incluye `body`). Valida acceso premium.

**Auth:** JWT

**Path Parameters:**

| Param | Tipo | Ejemplo |
|-------|------|---------|
| `id` | string | `clx123...` |

**Response `200`:**

```typescript
{
  id: string
  type: "route"
  title: string
  description: string | null
  topic: string | null
  locale: string           // default: "es-LATAM"
  version: number
  isPublished: boolean
  isPremium: boolean
  body: object             // JSON flexible — estructura del contenido
  sources: string[]        // URLs a papers científicos
  disclaimerId: string | null
  createdAt: string
  updatedAt: string
}
```

**Errores:**

| Código | Causa |
|--------|-------|
| 403 | Contenido premium sin suscripción activa |
| 404 | Ruta no encontrada |

---

### `GET /v1/content/library`

Biblioteca de contenido filtrable (ejercicios y artículos).

**Auth:** JWT

**Query Parameters:**

| Param | Tipo | Requerido | Valores |
|-------|------|-----------|---------|
| `topic` | string | No | `ansiedad`, `sueño`, etc. |
| `type` | string | No | `exercise`, `article` |

**Response `200`:**

```typescript
Array<ContentItem>   // misma estructura que GET /content/routes/:id
```

---

### `GET /v1/content/items/:id`

Detalle de cualquier tipo de contenido. Valida acceso premium.

**Auth:** JWT

**Path Parameters:**

| Param | Tipo |
|-------|------|
| `id` | string |

**Response `200`:**

```typescript
ContentItem   // misma estructura que GET /content/routes/:id
```

**Errores:**

| Código | Causa |
|--------|-------|
| 403 | Contenido premium sin suscripción activa |
| 404 | Contenido no encontrado |

---

### `POST /v1/content`

Crear nuevo contenido terapéutico.

**Auth:** JWT

**Request Body:**

```typescript
{
  type: string            // required — "route" | "day" | "exercise" | "article"
  title: string           // required
  description?: string    // optional
  topic?: string          // optional — ej: "ansiedad"
  locale?: string         // optional — default: "es-LATAM"
  body: object            // required — JSON con la estructura del contenido
  sources?: string[]      // optional — URLs de referencias científicas
  disclaimerId?: string   // optional
  version?: number        // optional — default: 1, @IsInt
  isPremium?: boolean     // optional — default: true
  isPublished?: boolean   // optional — default: true
}
```

**Response `201`:**

```typescript
ContentItem   // estructura completa
```

---

### `PATCH /v1/content/:id`

Editar contenido existente. Todos los campos son opcionales (partial update).

**Auth:** JWT

**Path Parameters:**

| Param | Tipo |
|-------|------|
| `id` | string |

**Request Body:**

```typescript
Partial<CreateContentDto>   // todos los campos del POST son opcionales
```

**Response `200`:**

```typescript
ContentItem
```

**Errores:**

| Código | Causa |
|--------|-------|
| 404 | Contenido no encontrado |

---

## 4. Admin

> Todos los endpoints requieren `JWT + rol ADMIN`. Usuarios sin rol admin reciben `403`.

### `GET /v1/admin/dashboard`

Estadísticas globales del sistema.

**Auth:** JWT + ADMIN

**Response `200`:**

```typescript
{
  users: {
    total: number
    premium: number       // usuarios con status = "ACTIVE"
  }
  content: number         // total de ContentItems
  generatedAt: string     // ISO 8601
}
```

---

### `GET /v1/admin/users`

Listar usuarios más recientes.

**Auth:** JWT + ADMIN

**Query Parameters:**

| Param | Tipo | Requerido | Default |
|-------|------|-----------|---------|
| `limit` | string | No | `20` |

**Response `200`:**

```typescript
Array<{
  id: string
  email: string
  role: "USER" | "ADMIN"
  createdAt: string
}>
```

---

### `DELETE /v1/admin/users/:id`

Eliminar usuario permanentemente.

**Auth:** JWT + ADMIN

**Path Parameters:**

| Param | Tipo |
|-------|------|
| `id` | string |

**Response `200`:**

```typescript
User   // objeto del usuario eliminado
```

**Efectos secundarios:** Se registra en AuditLog con `action = "DELETE_USER"`.

---

### `DELETE /v1/admin/content/:id`

Eliminar contenido permanentemente.

**Auth:** JWT + ADMIN

**Path Parameters:**

| Param | Tipo |
|-------|------|
| `id` | string |

**Response `200`:**

```typescript
ContentItem   // objeto del contenido eliminado
```

---

## 5. Analytics

### `POST /v1/analytics/track`

Enviar evento de analytics. Respeta consentimiento del usuario.

**Auth:** JWT

**Request Body:**

```typescript
{
  event: string               // required — ej: "exercise_completed", "route_started"
  properties?: Record<string, any>  // optional — ej: { duration: 120, exerciseId: "xyz" }
}
```

**Response `200`:**

```typescript
{
  status: "queued" | "skipped"
  reason?: "no_consent"        // presente si status = "skipped"
}
```

**Lógica:**
- Si `consent.analytics = false` → `{ status: "skipped", reason: "no_consent" }`
- Sanitiza properties (elimina: `email`, `password`, `diary_content`)
- Envía a PostHog si está configurado

---

## 6. Consent

### `GET /v1/consent`

Obtener consentimientos actuales de privacidad.

**Auth:** JWT

**Response `200`:**

```typescript
{
  id?: string               // presente si existe registro en BD
  analytics: boolean        // default: false
  sync: boolean             // default: false
  policyVersion: string     // default: "1.0"
  updatedAt?: string        // presente si existe registro
}
```

**Lógica:** Si no existe registro, devuelve defaults con todo en `false` (privacy by default).

---

### `PUT /v1/consent`

Actualizar consentimientos de privacidad.

**Auth:** JWT

**Request Body:**

```typescript
{
  analytics?: boolean       // optional — default: false
  sync?: boolean            // optional — default: false
  policyVersion?: string    // optional — default: "1.0"
}
```

**Response `200`:**

```typescript
{
  id: string
  userId: string
  analytics: boolean
  sync: boolean
  policyVersion: string
  updatedAt: string
}
```

**Lógica:** Upsert — crea si no existe, actualiza si existe.

---

## 7. Entitlements (Suscripciones)

### `GET /v1/entitlements`

Estado de suscripción del usuario.

**Auth:** JWT

**Response `200`:**

```typescript
{
  id?: string                              // presente si existe registro
  status: "FREE" | "ACTIVE" | "EXPIRED" | "TRIAL"
  expiresAt: string | null
  platform?: "apple" | "google"            // presente si tiene suscripción
  productId?: string                       // presente si tiene suscripción
  updatedAt?: string
}
```

---

### `POST /v1/entitlements/purchase/validate`

Validar recibo de compra de App Store / Google Play y activar premium.

**Auth:** JWT

**Request Body:**

```typescript
{
  platform: "apple" | "google"    // required — @IsIn(["apple", "google"])
  productId: string               // required
  receipt: string                  // required — recibo en base64
}
```

**Response `200`:**

```typescript
{
  id: string
  userId: string
  status: "ACTIVE"
  expiresAt: string              // fecha actual + 1 mes
  platform: "apple" | "google"
  productId: string
  updatedAt: string
}
```

**Errores:**

| Código | Causa |
|--------|-------|
| 400 | Recibo inválido / rechazado por la tienda |

**Efectos secundarios:**
- Crea registro en `PurchaseReceipt` (siempre, válido o no)
- Upsert en `SubscriptionEntitlement` con `status = "ACTIVE"`
- `expiresAt` = fecha actual + 1 mes

---

## 8. Flags (Feature Flags)

### `GET /v1/flags`

Obtener feature flags y variantes para el usuario actual.

**Auth:** JWT

**Response `200`:**

```typescript
{
  [flagName: string]: any
}
// Ejemplo:
{
  "show-new-onboarding": "variant-a",
  "paywall-delay-seconds": 5,
  "enable-christmas-theme": false
}
```

**Lógica:** Consulta PostHog si está configurado; si no, devuelve defaults locales.

---

## 9. Help (Recursos de Ayuda)

### `GET /v1/help/resources`

Recursos de ayuda (líneas telefónicas, sitios web) por país.

**Auth:** JWT

**Query Parameters:**

| Param | Tipo | Requerido | Ejemplo |
|-------|------|-----------|---------|
| `country` | string | No | `MX`, `CO`, `ES`, `GLOBAL` |

**Response `200`:**

```typescript
Array<{
  id: string
  country: string          // ISO 2 letras o "GLOBAL"
  name: string             // ej: "Línea de la Vida"
  description: string | null
  phoneNumber: string | null
  websiteUrl: string | null
  isEmergency: boolean     // true = resaltar como urgente
  createdAt: string
  updatedAt: string
}>
```

**Lógica:**
1. Si se envía `country` → filtrar por ese país
2. Si no → usar `req.user.country` o fallback a `"MX"`
3. Si no hay recursos para el país → devolver recursos `"GLOBAL"`
4. Ordenados por `isEmergency DESC` (emergencias primero)

---

### `POST /v1/help`

Crear recurso de ayuda.

**Auth:** JWT + ADMIN

**Request Body:**

```typescript
{
  country: string           // required — regex: /^([A-Z]{2}|GLOBAL)$/
  name: string              // required
  description?: string      // optional
  phoneNumber?: string      // optional
  websiteUrl?: string       // optional
  isEmergency?: boolean     // optional — default: false
}
```

**Response `201`:**

```typescript
HelpResource   // misma estructura que GET /help/resources[n]
```

---

### `DELETE /v1/help/:id`

Eliminar recurso de ayuda.

**Auth:** JWT + ADMIN

**Path Parameters:**

| Param | Tipo |
|-------|------|
| `id` | string |

**Response `200`:**

```typescript
HelpResource   // objeto eliminado
```

---

## 10. Privacy (GDPR)

### `GET /v1/privacy/export`

Exportar todos los datos personales del usuario en formato JSON (Derecho de Acceso GDPR).

**Auth:** JWT

**Response `200`:**

```typescript
{
  _generatedAt: string
  user: {
    id: string
    email: string
    name: string | null
    avatarUrl: string | null
    role: "USER" | "ADMIN"
    locale: string
    country: string | null
    timezone: string | null
    profile: object | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    consent: {
      id: string
      userId: string
      analytics: boolean
      sync: boolean
      policyVersion: string
      updatedAt: string
    } | null
    entitlements: {
      id: string
      userId: string
      status: string
      expiresAt: string | null
      platform: string | null
      productId: string | null
      updatedAt: string
    } | null
    syncRecords: Array<{
      id: string
      userId: string
      entityType: string
      entityId: string
      data: any
      deviceUpdatedAt: string
      serverUpdatedAt: string
      isDeleted: boolean
    }>
  }
}
```

**Errores:**

| Código | Causa |
|--------|-------|
| 404 | Usuario no encontrado |

---

### `DELETE /v1/privacy/delete`

Eliminar cuenta permanentemente (Derecho al Olvido GDPR).

**Auth:** JWT

**Response `204`:** Sin body

**Efectos secundarios:**
- Elimina registro `User`
- Cascade delete: `Consent`, `SubscriptionEntitlement`, `SyncRecord`
- **Preserva** `PurchaseReceipt` (requerimiento legal/contable)

---

## 11. Receipts

### `GET /v1/receipts`

Historial de recibos de compra del usuario.

**Auth:** JWT

**Response `200`:**

```typescript
Array<{
  id: string
  productId: string
  platform: "apple" | "google"
  validatedAt: string
  status: "VALID" | "INVALID"
}>
```

**Nota:** No expone `rawReceipt` ni `transactionId` por seguridad.

---

## 12. Sync (Sincronización de Datos)

### `POST /v1/sync/push`

Subir cambios locales del cliente al servidor.

**Auth:** JWT

**Request Body:**

```typescript
{
  changes: Array<{
    entityType: string          // required — ej: "journal_entry", "route_progress", "favorite"
    entityId: string            // required — UUID v4 generado por el cliente
    data: any                   // required — JSON, idealmente cifrado por el cliente
    deviceUpdatedAt: string     // required — ISO 8601 (ej: "2026-03-17T10:00:00Z")
    isDeleted?: boolean         // optional — default: false (tombstone para soft delete)
  }>
}
```

**Response `200`:**

```typescript
{
  processed: number       // cantidad de registros creados/actualizados
  serverTime: string      // ISO 8601 — guardar para el próximo pull
}
```

**Errores:**

| Código | Causa |
|--------|-------|
| 403 | `consent.sync = false` — sincronización desactivada |

**Lógica:**
- Upsert por constraint único: `[userId, entityType, entityId]`
- Si el registro existe, lo actualiza; si no, lo crea

---

### `POST /v1/sync/pull`

Descargar cambios del servidor desde la última sincronización.

**Auth:** JWT

**Request Body:**

```typescript
{
  lastSyncAt?: string     // optional — ISO 8601 (ej: "2026-03-17T10:00:00Z")
}
```

**Response `200`:**

```typescript
{
  changes: Array<{
    entityType: string
    entityId: string
    data: any
    deviceUpdatedAt: string
    serverUpdatedAt: string
    isDeleted: boolean
  }>
  serverTime: string      // ISO 8601 — guardar para el próximo pull
}
```

**Errores:**

| Código | Causa |
|--------|-------|
| 403 | `consent.sync = false` — sincronización desactivada |

**Lógica:**
- Si `lastSyncAt` proporcionado → solo registros donde `serverUpdatedAt > lastSyncAt`
- Si no → devuelve todos los registros del usuario

---

## 13. Health

### `GET /v1/health`

Health check del sistema (base de datos + memoria).

**Auth:** No

**Response `200`:**

```typescript
{
  status: "ok" | "error"
  details: {
    database: {
      status: "up" | "down"
    }
    memory_heap: {
      status: "up" | "down"
      details: {
        heapUsed: number       // bytes
        heapMax: number        // bytes (límite: 150MB)
      }
    }
  }
}
```

---

## Resumen de Endpoints

| # | Método | Ruta | Auth | Descripción |
|---|--------|------|------|-------------|
| 1 | POST | `/auth/register` | - | Registro |
| 2 | POST | `/auth/login` | - | Login email/password |
| 3 | POST | `/auth/google` | - | Login Google OAuth |
| 4 | GET | `/auth/me` | JWT | Perfil autenticado |
| 5 | PATCH | `/users/me` | JWT | Actualizar perfil |
| 6 | GET | `/content/catalog` | JWT | Catálogo de rutas |
| 7 | GET | `/content/exercises` | JWT | Listar ejercicios |
| 8 | GET | `/content/routes/:id` | JWT | Detalle de ruta |
| 9 | GET | `/content/library` | JWT | Biblioteca filtrable |
| 10 | GET | `/content/items/:id` | JWT | Detalle de contenido |
| 11 | POST | `/content` | JWT | Crear contenido |
| 12 | PATCH | `/content/:id` | JWT | Editar contenido |
| 13 | GET | `/admin/dashboard` | ADMIN | Estadísticas |
| 14 | GET | `/admin/users` | ADMIN | Listar usuarios |
| 15 | DELETE | `/admin/users/:id` | ADMIN | Eliminar usuario |
| 16 | DELETE | `/admin/content/:id` | ADMIN | Eliminar contenido |
| 17 | POST | `/analytics/track` | JWT | Evento analytics |
| 18 | GET | `/consent` | JWT | Ver consentimientos |
| 19 | PUT | `/consent` | JWT | Actualizar consentimientos |
| 20 | GET | `/entitlements` | JWT | Estado suscripción |
| 21 | POST | `/entitlements/purchase/validate` | JWT | Validar compra |
| 22 | GET | `/flags` | JWT | Feature flags |
| 23 | GET | `/help/resources` | JWT | Recursos de ayuda |
| 24 | POST | `/help` | ADMIN | Crear recurso |
| 25 | DELETE | `/help/:id` | ADMIN | Eliminar recurso |
| 26 | GET | `/privacy/export` | JWT | Exportar datos GDPR |
| 27 | DELETE | `/privacy/delete` | JWT | Eliminar cuenta GDPR |
| 28 | GET | `/receipts` | JWT | Historial de recibos |
| 29 | POST | `/sync/push` | JWT | Subir datos sync |
| 30 | POST | `/sync/pull` | JWT | Bajar datos sync |
| 31 | GET | `/health` | - | Health check |

**Total: 31 endpoints** — 4 públicos, 20 protegidos JWT, 7 solo ADMIN

---

## Relaciones entre Modelos

```
User (1:1) ──→ Consent          (onDelete: Cascade)
User (1:1) ──→ SubscriptionEntitlement  (onDelete: Cascade)
User (1:N) ──→ SyncRecord       (onDelete: Cascade)
User (1:N) ──→ PurchaseReceipt  (NO cascade — se preserva)

ContentItem    — independiente, sin FK a User
HelpResource   — independiente, sin FK a User
AuditLog       — referencia adminId (string), sin FK
```

### Constraint Único en SyncRecord

```
@@unique([userId, entityType, entityId])
```

---

## Lógica de Acceso Premium

```
¿Tiene SubscriptionEntitlement?
  └─ No  → status = "FREE"
  └─ Sí  → ¿status = "ACTIVE" o "TRIAL"?
              └─ Sí  → ¿expiresAt > ahora?
              │          └─ Sí  → acceso premium ✅
              │          └─ No  → status = "EXPIRED" ❌
              └─ No  → sin acceso premium ❌

Contenido con isPremium = false → accesible para todos
Contenido con isPremium = true  → solo usuarios con acceso premium
```
