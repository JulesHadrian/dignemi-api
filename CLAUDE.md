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

## Docker

Docker Compose configurado para desarrollo local:
- PostgreSQL en puerto 5432
- Configuración en `docker-compose.yml`

## Recursos

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Swagger/OpenAPI](https://swagger.io/specification/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
