# CLAUDE.md - Luzentia Backend

## Descripción del Proyecto

**Luzentia** es un backend REST API para una aplicación móvil de salud mental y bienestar emocional. Proporciona funcionalidades de autenticación, gestión de contenido terapéutico, sistema de suscripciones, sincronización de datos del usuario y recursos de ayuda geolocalizada.

## Stack Tecnológico

### Core
- **Framework**: NestJS 11.x (Node.js framework)
- **Lenguaje**: TypeScript 5.7.x
- **Runtime**: Node.js
- **Base de datos**: PostgreSQL
- **ORM**: Prisma 5.22.0

### Librerías Principales
- **Autenticación**:
  - `@nestjs/jwt` - JSON Web Tokens
  - `@nestjs/passport` + `passport-jwt` - Estrategias de autenticación
  - `bcrypt` - Hashing de contraseñas
- **Validación**:
  - `class-validator` - Validación de DTOs
  - `class-transformer` - Transformación de objetos
  - `joi` - Validación de variables de entorno
- **Documentación**:
  - `@nestjs/swagger` - OpenAPI/Swagger
- **HTTP Client**:
  - `@nestjs/axios` - Cliente HTTP para llamadas externas
- **Analytics**:
  - `posthog-node` - Eventos y métricas
- **Health Checks**:
  - `@nestjs/terminus` - Monitoreo de salud de la API

### Testing
- **Framework**: Jest 30.x
- **E2E Testing**: Supertest
- **Coverage**: Jest coverage integrado

### Code Quality
- **Linter**: ESLint 9.x
- **Formatter**: Prettier 3.x
- **Type Checking**: TypeScript strict mode

## Arquitectura

### Patrón Arquitectónico
El proyecto sigue una **arquitectura modular de NestJS** con separación clara de responsabilidades:

```
src/
├── admin/          # Gestión de administradores
├── analytics/      # Tracking de eventos (PostHog)
├── audit/          # Logs de auditoría
├── auth/           # Autenticación y autorización JWT
├── common/         # Utilidades compartidas
│   ├── decorators/ # Decoradores personalizados (@Roles)
│   ├── filters/    # Filtros de excepciones globales
│   └── guards/     # Guards de autorización (RolesGuard)
├── config/         # Validación de variables de entorno
├── consent/        # Gestión de consentimientos GDPR
├── content/        # Contenido terapéutico (rutas, ejercicios, artículos)
├── entitlements/   # Estado de suscripciones de usuarios
├── flags/          # Feature flags / configuraciones dinámicas
├── health/         # Health checks y endpoints de monitoreo
├── help/           # Recursos de ayuda geolocalizada
├── privacy/        # Gestión de privacidad y exportación de datos
├── receipts/       # Validación de compras (Apple/Google)
├── seeder/         # Seeds de contenido inicial (tests y ejercicios)
├── sync/           # Sincronización de datos del usuario
└── users/          # Gestión de usuarios
```

### Patrón de Módulos
Cada módulo sigue la estructura estándar de NestJS:
- **Controller**: Define los endpoints REST
- **Service**: Lógica de negocio
- **Module**: Configuración de dependencias
- **DTOs**: Data Transfer Objects con validación
- **Guards/Decorators**: Autorización y metadatos (cuando aplica)

### Sistema de Seeds

El proyecto tiene un sistema dual de seeding para contenido inicial (tests psicométricos y ejercicios terapéuticos):

#### Componentes
- **`src/seeder/content-seeds.ts`** — Fuente de verdad con los datos de seeds (array `CONTENT_SEEDS`)
- **`src/seeder/seeder.service.ts`** — Servicio NestJS que implementa `OnApplicationBootstrap` para ejecutar seeds al iniciar la app (producción)
- **`src/seeder/seeder.module.ts`** — Módulo importado en `AppModule`
- **`prisma/seed.ts`** — Script CLI ejecutado con `npx prisma db seed` (desarrollo)

#### Convenciones de Seeds
- IDs fijos con prefijo `seed-` (ej: `seed-gad2`, `seed-phq9`) para upserts idempotentes
- Upsert con `update: {}` — solo crea si no existe, nunca sobrescribe
- Ambos caminos (CLI y bootstrap) comparten la misma fuente de datos (`CONTENT_SEEDS`)
- `prisma/` está excluido de `tsconfig.build.json` para no contaminar el build de NestJS

#### Seeds Actuales
| ID | Tipo | Título | Tema |
|----|------|--------|------|
| `seed-gad2` | test | GAD-2 | ansiedad |
| `seed-gad7` | test | GAD-7 | ansiedad |
| `seed-phq2` | test | PHQ-2 | ánimo bajo |
| `seed-phq9` | test | PHQ-9 | ánimo bajo |
| `seed-respiracion-diafragmatica` | exercise | Respiración diafragmática | ansiedad |
| `seed-mindfulness-respiratorio-breve` | exercise | Mindfulness respiratorio breve | ansiedad |
| `seed-caminata-consciente` | exercise | Caminata consciente | ansiedad |
| `seed-relajacion-nocturna-breve` | exercise | Relajación nocturna breve | ansiedad |
| `seed-relajacion-muscular-progresiva` | exercise | Relajación muscular progresiva | ansiedad |
| `seed-visualizacion-lugar-seguro` | exercise | Visualización de lugar seguro | ansiedad |
| `seed-tiempo-de-preocupacion` | exercise | Tiempo de preocupación | ansiedad |
| `seed-resolucion-de-problemas-basica` | exercise | Resolución de problemas básica | ansiedad |
| `seed-facing-fears-exposicion-gradual` | exercise | Facing fears / exposición gradual guiada | ansiedad |

#### Cómo añadir un nuevo seed
1. Añadir el objeto al array `CONTENT_SEEDS` en `src/seeder/content-seeds.ts`
2. Usar un ID fijo con prefijo `seed-` (ej: `seed-dass21`)
3. El seed se aplicará automáticamente al iniciar la app y con `npx prisma db seed`

### Base de Datos (Prisma Schema)

#### Modelos Principales:

1. **User**: Información del usuario con soft deletes
   - Roles: `USER` | `ADMIN`
   - Preferencias: locale, country, timezone
   - Perfil flexible (JSON) para onboarding
   - Relaciones: entitlements, consent, syncRecords

2. **Consent**: Permisos GDPR (1:1 con User)
   - `analytics`: Permiso para tracking
   - `sync`: Permiso para guardar datos en la nube
   - `policyVersion`: Control de versiones de política

3. **SubscriptionEntitlement**: Estado de suscripción (1:1 con User)
   - Status: `FREE` | `ACTIVE` | `EXPIRED` | `TRIAL`
   - Soporte para Apple y Google Play

4. **PurchaseReceipt**: Validación de compras en tiendas
   - Guarda recibos raw para auditoría
   - Status: `VALID` | `INVALID`

5. **ContentItem**: Contenido terapéutico flexible
   - Tipos: `route`, `day`, `exercise`, `article`
   - Body en JSON (flexible)
   - Control de versiones y publicación
   - Flag `isPremium` para paywall

6. **SyncRecord**: Sincronización de datos del usuario
   - Soporta múltiples tipos de entidades
   - Control de conflictos con timestamps
   - Soft deletes con tombstones

7. **HelpResource**: Recursos de ayuda por país
   - Líneas telefónicas, sitios web
   - Flag `isEmergency` para casos críticos

8. **AuditLog**: Auditoría de acciones de administradores

### Autenticación y Autorización

- **Estrategia**: JWT con Bearer tokens
- **Guard**: `JwtAuthGuard` para proteger rutas
- **Roles**: Sistema de roles con `@Roles()` decorator y `RolesGuard`
- **Validación**: Tokens verificados con secret en `.env`

### API Versioning

- **Prefijo global**: `/v1`
- **Tipo**: URI-based versioning
- **Documentación**: Swagger en `/docs` (solo desarrollo)

### Validación Global

```typescript
ValidationPipe configurado con:
- whitelist: true           // Elimina propiedades no definidas en DTOs
- forbidNonWhitelisted: true // Error si envían datos extra
- transform: true            // Transforma payloads a instancias de DTOs
```

### Manejo de Errores

- **Filter global**: `AllExceptionsFilter` para respuestas consistentes
- Respuestas estructuradas con códigos HTTP apropiados

## Variables de Entorno

```env
NODE_ENV=development|production
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/luzentia_db?schema=public"
JWT_SECRET="mi_clave_secreta_super_segura_123"
POSTHOG_API_KEY=""
POSTHOG_HOST="https://app.posthog.com"
```

Validadas con **Joi schema** en `src/config/env.validation.ts`

## Scripts Importantes

```bash
# Desarrollo
npm run start:dev          # Watch mode con hot reload

# Producción
npm run build              # Compilar TypeScript
npm run start:prod         # Ejecutar build

# Testing
npm run test               # Unit tests
npm run test:e2e           # End-to-end tests
npm run test:cov           # Coverage report

# Code Quality
npm run lint               # ESLint con auto-fix
npm run format             # Prettier

# Base de datos (Prisma)
npx prisma migrate dev     # Crear y aplicar migraciones
npx prisma generate        # Generar Prisma Client
npx prisma studio          # UI visual de BD
npx prisma db push         # Push schema sin migración
npx prisma db seed         # Ejecutar seeds manualmente

# Deploy (producción)
npm run deploy:migrate     # prisma migrate deploy + db seed
```

## Convenciones de Código

### Naming
- **Archivos**: `kebab-case` (e.g., `auth.service.ts`)
- **Clases**: `PascalCase` (e.g., `AuthService`)
- **Métodos/Variables**: `camelCase` (e.g., `validateUser`)
- **Constantes**: `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`)

### Estructura de DTOs
- Usar `class-validator` decorators (`@IsString()`, `@IsEmail()`, etc.)
- Definir DTOs separados para Create/Update cuando aplique
- Exportar DTOs desde el módulo correspondiente

### Servicios
- Inyectar `PrismaService` para acceso a base de datos
- Manejar errores con excepciones de NestJS (`NotFoundException`, `BadRequestException`, etc.)
- Lógica de negocio en servicios, NO en controllers

### Controllers
- Usar decoradores de Swagger (`@ApiTags()`, `@ApiResponse()`, etc.)
- Proteger rutas con `@UseGuards(JwtAuthGuard)`
- Usar `@Roles()` decorator para control de acceso basado en roles

## Compliance y Seguridad

### GDPR y Privacidad
- **Soft deletes**: Campo `deletedAt` en User
- **Consentimientos**: Modelo `Consent` para tracking/sync
- **Exportación de datos**: Endpoint en `PrivacyModule`
- **Cifrado**: Cliente cifra datos sensibles antes de enviar a `SyncRecord`

### Seguridad
- Contraseñas hasheadas con **bcrypt**
- JWT tokens con expiración
- CORS habilitado (configurar origins en producción)
- Validación estricta de inputs con DTOs
- Audit logs para acciones administrativas

### Compliance Legal
- **Disclaimers**: Campo `disclaimerId` en ContentItem
- **Fuentes**: Array de referencias científicas en ContentItem
- **Recursos de emergencia**: HelpResource con flag `isEmergency`

## Integraciones Externas

### PostHog (Analytics)
- Módulo: `AnalyticsModule`
- Tracking de eventos del usuario
- Respetar flag `consent.analytics`

### Tiendas de Apps
- Validación de recibos de Apple y Google Play
- Actualización de `SubscriptionEntitlement` tras validación

## Documentación Clave

### Contratos de API
> **Fuente de verdad**: [`docs/api-contracts.md`](docs/api-contracts.md)
>
> - Antes de crear un endpoint → documentarlo ahí
> - Antes de consumir un endpoint → verificar ahí
> - Si hay discrepancia entre código y contrato → **el contrato manda**

### Convenciones de Código
> **Ubicación**: [`docs/conventions.md`](docs/conventions.md)
>
> - La ley del proyecto — seguir al pie de la letra
> - Nombrado, imports, patrones de controllers/services/DTOs, errores, testing
> - Secciones "Qué hacer" y "Qué NO hacer"

### Changelog
> **Ubicación**: [`CHANGELOG.md`](CHANGELOG.md)
>
> - Memoria histórica del proyecto con contexto para la IA
> - Cada entrada tiene "Notas para la IA" que explican impacto y decisiones revertidas
> - Al hacer cambios significativos → añadir entrada al changelog

### Decisiones Arquitectónicas (ADRs)
> **Ubicación**: [`docs/decisions/`](docs/decisions/)
> **Template**: [`docs/decisions/_template.md`](docs/decisions/_template.md)
>
> - Antes de proponer una alternativa tecnológica → revisar si ya fue descartada en un ADR
> - Al tomar una decisión nueva → crear un ADR con la sección "Notas para la IA"
>
> **ADRs activos:**
> - [ADR-001: Dependencias Core](docs/decisions/001-dependencias-core.md) — stack, ORM, auth, validación, analytics, testing

## Endpoints Existentes (Inventario)

### Auth (`/v1/auth`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Registrar nuevo usuario |
| POST | `/auth/login` | No | Login con email/password |
| POST | `/auth/google` | No | Login con Google OAuth |
| GET | `/auth/me` | JWT | Obtener perfil del usuario autenticado |

### Users (`/v1/users`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| PATCH | `/users/me` | JWT | Actualizar perfil del usuario |

### Content (`/v1/content`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/content/catalog` | JWT | Catálogo de contenido (todos los tipos, filtrable por `?type`) |
| GET | `/content/exercises` | JWT | Listar ejercicios (query: `topic`) |
| GET | `/content/routes/:id` | JWT | Detalle de una ruta |
| GET | `/content/library` | JWT | Biblioteca filtrable (query: `topic`, `type`) |
| GET | `/content/items/:id` | JWT | Detalle de un contenido |
| POST | `/content` | JWT | Crear contenido |
| PATCH | `/content/:id` | JWT | Editar contenido |

### Admin (`/v1/admin`) — Requiere rol `ADMIN`
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/admin/dashboard` | JWT + ADMIN | Estadísticas del dashboard |
| GET | `/admin/users` | JWT + ADMIN | Listar usuarios (query: `limit`) |
| DELETE | `/admin/users/:id` | JWT + ADMIN | Eliminar usuario (soft delete) |
| DELETE | `/admin/content/:id` | JWT + ADMIN | Eliminar contenido |

### Analytics (`/v1/analytics`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/analytics/track` | JWT | Enviar evento de tracking |

### Consent (`/v1/consent`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/consent` | JWT | Obtener consentimientos actuales |
| PUT | `/consent` | JWT | Actualizar consentimientos |

### Entitlements (`/v1/entitlements`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/entitlements` | JWT | Estado de suscripción |
| POST | `/entitlements/purchase/validate` | JWT | Validar compra de tienda |

### Flags (`/v1/flags`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/flags` | JWT | Obtener feature flags |

### Health (`/v1/health`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/health` | No | Health check (Terminus) |

### Help (`/v1/help`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/help/resources` | JWT | Recursos de ayuda por país |
| POST | `/help` | JWT + ADMIN | Crear recurso de ayuda |
| DELETE | `/help/:id` | JWT + ADMIN | Eliminar recurso de ayuda |

### Privacy (`/v1/privacy`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/privacy/export` | JWT | Exportar datos del usuario (GDPR) |
| DELETE | `/privacy/delete` | JWT | Eliminar cuenta (GDPR) |

### Receipts (`/v1/receipts`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/receipts` | JWT | Listar recibos del usuario |

### Sync (`/v1/sync`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/sync/push` | JWT | Enviar datos del cliente al servidor |
| POST | `/sync/pull` | JWT | Obtener cambios del servidor |

**Resumen**: 29 endpoints totales — 4 públicos, 18 protegidos con JWT, 7 solo ADMIN.

## Patrones de Manejo de Errores

### Formato estándar de error (AllExceptionsFilter)
Todas las excepciones se capturan globalmente y devuelven:
```json
{
  "statusCode": 409,
  "timestamp": "2026-03-17T...",
  "path": "/v1/auth/register",
  "error": "El correo electrónico ya está registrado"
}
```

### Excepciones usadas en el proyecto
Solo se usan excepciones nativas de NestJS, **no hay excepciones custom**:

| Excepción | Status | Cuándo usarla |
|-----------|--------|---------------|
| `ConflictException` | 409 | Recurso ya existe (ej: email duplicado) |
| `UnauthorizedException` | 401 | Credenciales inválidas, token inválido, cuenta eliminada |
| `ForbiddenException` | 403 | Sin acceso premium, sin rol requerido, sync desactivado |
| `NotFoundException` | 404 | Recurso no encontrado |
| `BadRequestException` | 400 | Datos inválidos (ej: recibo rechazado) |

### Patrón en servicios
- Lanzar excepciones directamente, sin try-catch-rethrow innecesario
- Mensajes de error en **español** para el usuario final
- No se usa un wrapper de respuesta — las respuestas exitosas devuelven el objeto directamente

### Patrón de auditoría
```typescript
// Fire-and-forget — no bloquea la respuesta
this.auditService.logAction(adminId, 'DELETE_USER', userId, `User email: ${email}`);
```

## Patrones de Testing

- Tests unitarios en archivos `*.spec.ts` junto al archivo que testean
- E2E tests en carpeta `test/`
- Usar `Test.createTestingModule()` para inyección de dependencias en tests
- Mockear `PrismaService` en tests unitarios
- **Estado actual**: Solo existe `app.controller.spec.ts` — cobertura mínima

## Reglas Inquebrantables

### Seguridad
1. **NUNCA** crear un endpoint sin `@UseGuards(AuthGuard('jwt'))` a menos que sea público por diseño (auth/register, auth/login, health)
2. **NUNCA** exponer datos de un usuario a otro — siempre filtrar por `userId` del token JWT
3. **NUNCA** commitear secrets, `.env`, o credenciales al repositorio
4. **NUNCA** poner lógica de negocio en controllers — solo en services
5. **NUNCA** confiar en datos del cliente sin validar con DTOs y `class-validator`

### Privacidad y GDPR
6. **NUNCA** enviar datos de analytics sin verificar `consent.analytics === true`
7. **NUNCA** sincronizar datos sin verificar `consent.sync === true`
8. **NUNCA** hacer hard delete de usuarios — usar soft delete (`deletedAt`)
9. **SIEMPRE** incluir los datos del usuario en el endpoint de exportación GDPR (`/privacy/export`)

### Base de Datos
10. **NUNCA** modificar el schema de Prisma sin crear una migración (`npx prisma migrate dev --name <desc>`)
11. **SIEMPRE** regenerar el cliente después de cambios al schema (`npx prisma generate`)

### API y Código
12. **SIEMPRE** documentar endpoints nuevos con decoradores de Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`)
13. **SIEMPRE** usar excepciones nativas de NestJS — no crear excepciones custom
14. **SIEMPRE** escribir mensajes de error en español para el usuario final
15. **SIEMPRE** proteger endpoints de admin con `@Roles('ADMIN')` y `RolesGuard`

## Notas Importantes

1. **Toda nueva funcionalidad debe**:
   - Tener su propio módulo NestJS
   - Incluir DTOs validados
   - Documentarse en Swagger
   - Respetar permisos y consentimientos

2. **Al modificar Prisma schema**:
   - Ejecutar `npx prisma migrate dev --name <descripcion>`
   - Regenerar cliente con `npx prisma generate`

3. **Al añadir endpoints**:
   - Usar decoradores de Swagger apropiados
   - Proteger con guards necesarios
   - Validar con DTOs
   - **Actualizar el inventario de endpoints en este archivo**

4. **Testing**:
   - Los tests están en archivos `*.spec.ts`
   - E2E tests en carpeta `test/`
   - Ejecutar tests antes de commits importantes

5. **Deployment**:
   - Configurar `DATABASE_URL` de producción
   - Establecer `NODE_ENV=production`
   - Generar `JWT_SECRET` seguro
   - Configurar CORS con origins específicos
   - Swagger se deshabilita automáticamente en producción
   - Seeds se aplican automáticamente al iniciar la app (`OnApplicationBootstrap`)
   - También disponible con `npm run deploy:migrate` (migrate deploy + db seed)

## Docker

Docker Compose configurado para desarrollo local:
- PostgreSQL en puerto 5432
- Configuración en `docker-compose.yml`

## Recursos

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Swagger/OpenAPI](https://swagger.io/specification/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
