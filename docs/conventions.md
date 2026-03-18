# Convenciones de Código — Luzentia Backend

> **Este archivo es ley.** La IA debe seguirlo al pie de la letra.
> Si el código existente contradice algo aquí, este archivo manda.
> Si necesitas romper una regla, documéntalo en un ADR (`docs/decisions/`).

---

## 1. Nombrado

### Archivos

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Controller | `xxx.controller.ts` | `auth.controller.ts` |
| Service | `xxx.service.ts` | `auth.service.ts` |
| Module | `xxx.module.ts` | `auth.module.ts` |
| DTO | `xxx.dto.ts` o `create-xxx.dto.ts` | `auth.dto.ts`, `create-content.dto.ts` |
| Guard | `xxx.guard.ts` | `roles.guard.ts` |
| Decorator | `xxx.decorator.ts` | `current-user.decorator.ts` |
| Filter | `xxx.filter.ts` | `http-exception.filter.ts` |
| Strategy | `xxx.strategy.ts` | `jwt.strategy.ts` |
| Interface | `xxx.interface.ts` | `auth-user.interface.ts` |
| Test unitario | `xxx.spec.ts` | `app.controller.spec.ts` |
| Test E2E | `xxx.e2e-spec.ts` | `app.e2e-spec.ts` |

**Todos los archivos usan `kebab-case`.** Sin excepciones.

### Identificadores

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Clases | `PascalCase` | `AuthService`, `ContentController` |
| Métodos | `camelCase` | `getCatalog`, `validatePurchase` |
| Variables | `camelCase` | `hasPremiumAccess`, `passwordHash` |
| Constantes | `UPPER_SNAKE_CASE` | `BCRYPT_SALT_ROUNDS` |
| Interfaces | `PascalCase` | `AuthUser` |
| Enums (Prisma) | `PascalCase` | `Role`, `SubscriptionStatus` |
| Valores de enum | `UPPER_SNAKE_CASE` | `USER`, `ADMIN`, `FREE`, `ACTIVE` |

### DTOs

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Creación | `CreateXxxDto` | `CreateContentDto` |
| Actualización | `UpdateXxxDto` | `UpdateContentDto` |
| Acciones específicas | Nombre descriptivo | `RegisterDto`, `LoginDto`, `ValidatePurchaseDto` |

Los `UpdateDto` extienden `CreateDto` con `PartialType`:

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateContentDto } from './create-content.dto';

export class UpdateContentDto extends PartialType(CreateContentDto) {}
```

**`PartialType` se importa de `@nestjs/swagger`**, no de `@nestjs/mapped-types`. Esto es para que Swagger genere la documentación correctamente.

---

## 2. Imports

### Orden obligatorio

```typescript
// 1. NestJS core (@nestjs/common)
import { Controller, Post, Body, Get, UseGuards, Injectable } from '@nestjs/common';

// 2. Otros paquetes NestJS
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

// 3. Librerías de terceros
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

// 4. Imports locales del proyecto
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RegisterDto } from './dto/auth.dto';
```

### Reglas de imports

- Imports de tipos usan `import type { ... }` cuando solo se importa un tipo
- Imports de `@nestjs/common` se agrupan en una sola línea
- Imports de Prisma: `import { Prisma } from '@prisma/client'` para tipos, `PrismaService` para queries
- **Nunca** usar paths absolutos — siempre relativos (`../`, `./`)

---

## 3. Estructura de Módulos

### Orden de propiedades en `@Module({})`

Siempre en este orden:

```typescript
@Module({
  imports: [...],       // 1. Módulos importados
  controllers: [...],   // 2. Controllers
  providers: [...],     // 3. Services y providers
  exports: [...],       // 4. Services exportados (solo si otros módulos los necesitan)
})
```

### PrismaService

`PrismaService` vive en `src/prisma.service.ts` (raíz). Se inyecta como provider en cada módulo que lo necesite:

```typescript
@Module({
  controllers: [ContentController],
  providers: [ContentService, PrismaService],
})
export class ContentModule {}
```

**No** es un módulo global. Se registra explícitamente donde se usa.

### Módulos globales

Solo `AuditModule` es `@Global()`. No hacer otros módulos globales sin un ADR.

---

## 4. Controllers

### Orden de decoradores en la clase

```typescript
@ApiTags('Feature Name')         // 1. Tag de Swagger
@ApiBearerAuth()                 // 2. Auth en Swagger (si aplica)
@UseGuards(AuthGuard('jwt'))     // 3. Guard de JWT (si aplica)
@Controller('feature')           // 4. Ruta del controller
export class FeatureController {
```

Para rutas admin:

```typescript
@ApiTags('Admin Panel')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)   // JWT + Roles
@Controller('admin')
export class AdminController {
```

### Orden de decoradores en métodos

```typescript
@Post('register')                                                // 1. Método HTTP + ruta
@HttpCode(200)                                                   // 2. Código HTTP (si no es el default)
@Roles('ADMIN')                                                  // 3. Roles (si aplica)
@ApiOperation({ summary: 'Descripción corta del endpoint' })     // 4. Operación Swagger
@ApiResponse({ status: 201, description: 'Descripción' })        // 5. Respuestas Swagger
@ApiResponse({ status: 409, description: 'Conflicto' })
async register(@Body() dto: RegisterDto) {                       // 6. Firma del método
  return this.authService.register(dto.email, dto.password);
}
```

### Extracción de datos del request

```typescript
// Body → @Body()
async create(@Body() dto: CreateContentDto) {}

// Path params → @Param()
async getRoute(@Param('id') id: string) {}

// Query params → @Query()
async getExercises(@Query('topic') topic?: string) {}

// Usuario autenticado → @CurrentUser()
async getCatalog(@CurrentUser() user: AuthUser) {}

// Orden cuando hay multiples: @CurrentUser primero, luego @Param/@Query
async getRoute(@CurrentUser() user: AuthUser, @Param('id') id: string) {}
```

### Reglas de controllers

- **Retornar directamente** el resultado del servicio — sin wrappers
- **No** poner lógica de negocio en controllers
- **No** acceder a `req.user` directamente — usar `@CurrentUser()`
- **No** hacer try/catch en controllers — el `AllExceptionsFilter` global maneja los errores

```typescript
// CORRECTO
@Get('catalog')
getCatalog(@CurrentUser() user: AuthUser) {
  return this.contentService.getCatalog(user.userId);
}

// INCORRECTO — lógica en controller
@Get('catalog')
async getCatalog(@CurrentUser() user: AuthUser) {
  const items = await this.prisma.contentItem.findMany({...});
  return items.filter(i => !i.isPremium);
}

// INCORRECTO — try/catch innecesario
@Get('catalog')
async getCatalog(@CurrentUser() user: AuthUser) {
  try {
    return await this.contentService.getCatalog(user.userId);
  } catch (e) {
    throw new InternalServerErrorException();
  }
}
```

---

## 5. Services

### Inyección de dependencias

```typescript
@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private otherService: OtherService,
  ) {}
}
```

- Usar `private` sin `readonly`
- Una dependencia por línea
- Trailing comma después del último parámetro

### Constantes

Definir al inicio del archivo, antes de la clase:

```typescript
const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
```

### Orden de métodos

1. Métodos públicos `async` primero
2. Métodos privados `private async` al final

```typescript
@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  // Públicos primero
  async getCatalog(userId: string) { ... }
  async getItem(id: string, userId: string) { ... }
  async create(dto: CreateContentDto) { ... }

  // Privados al final
  private async validatePremiumAccess(userId: string, item: any) { ... }
}
```

### Uso de Prisma

Llamadas directas a `this.prisma` — sin wrappers ni repositorios:

```typescript
// Queries con select (para respuestas parciales)
const routes = await this.prisma.contentItem.findMany({
  where: { type: 'route', isPublished: true },
  select: { id: true, title: true, description: true },
});

// Filtros condicionales con spread
const items = await this.prisma.contentItem.findMany({
  where: {
    isPublished: true,
    ...(topic && { topic }),
    ...(type && { type }),
    ...(!hasPremiumAccess && { isPremium: false }),
  },
});

// Upsert para crear-o-actualizar
const consent = await this.prisma.consent.upsert({
  where: { userId },
  update: { analytics: dto.analytics, sync: dto.sync },
  create: { userId, analytics: dto.analytics, sync: dto.sync },
});

// Tipos de Prisma para updates type-safe
import { Prisma } from '@prisma/client';
async update(id: string, data: Prisma.UserUpdateInput) {
  return this.prisma.user.update({ where: { id }, data });
}
```

### Fire-and-forget

Para operaciones no críticas (audit logs), usar el patrón sin `await`:

```typescript
this.prisma.auditLog
  .create({ data: { adminId, action, targetId, details } })
  .catch((err) => console.error('Error writing audit log', err));
```

**Solo usar** para audit logs. Todo lo demás debe usar `await`.

---

## 6. DTOs

### Orden de decoradores en propiedades

```typescript
@ApiProperty({ example: 'usuario@ejemplo.com' })   // 1. Swagger
@IsEmail()                                           // 2. Tipo de validación
email: string;

@ApiProperty({ example: 'MiPassword123!' })          // 1. Swagger
@IsString()                                           // 2. Tipo
@MinLength(8)                                         // 3. Restricciones
@MaxLength(128)
password: string;

@ApiProperty({ example: 'María García', required: false })  // 1. Swagger (con required: false)
@IsString()                                                  // 2. Tipo
@IsOptional()                                                // 3. Opcionalidad
name?: string;                                               // Campo con ?
```

**Orden: `@ApiProperty` → validador de tipo → restricciones → `@IsOptional` (si aplica)**

### Campos opcionales

Siempre llevan ambos: `@IsOptional()` y `?` en el tipo:

```typescript
@ApiProperty({ required: false })
@IsString()
@IsOptional()
description?: string;
```

### Validadores usados en el proyecto

```typescript
// Importar de class-validator
import {
  IsEmail, IsString, IsBoolean, IsInt, IsArray, IsObject,
  IsNotEmpty, IsOptional, IsIn, IsISO8601,
  MinLength, MaxLength, Length, Matches,
  ValidateNested,
} from 'class-validator';

// Para arrays de objetos anidados
import { Type } from 'class-transformer';

@IsArray()
@ValidateNested({ each: true })
@Type(() => SyncRecordDto)
changes: SyncRecordDto[];
```

---

## 7. Manejo de Errores

### Solo excepciones nativas de NestJS

**No crear excepciones custom.** Usar exclusivamente:

| Excepción | Status | Cuándo |
|-----------|--------|--------|
| `BadRequestException` | 400 | Datos inválidos, recibo rechazado |
| `UnauthorizedException` | 401 | Credenciales inválidas, token inválido |
| `ForbiddenException` | 403 | Sin premium, sin rol, sin consentimiento |
| `NotFoundException` | 404 | Recurso no encontrado |
| `ConflictException` | 409 | Recurso duplicado (email ya existe) |

### Mensajes en español

Todos los mensajes de error orientados al usuario van en español:

```typescript
// CORRECTO
throw new ConflictException('El correo electrónico ya está registrado');
throw new ForbiddenException('Este contenido es premium. Necesitas una suscripción activa.');
throw new NotFoundException('Ruta no encontrada');

// INCORRECTO
throw new ConflictException('Email already registered');
```

### Sin try/catch innecesario

```typescript
// CORRECTO — lanzar directo
async login(email: string, password: string) {
  const user = await this.usersService.findOneByEmail(email);
  if (!user) {
    throw new UnauthorizedException('Credenciales inválidas');
  }
  // ...
}

// INCORRECTO — try/catch que re-lanza
async login(email: string, password: string) {
  try {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new Error('not found');
  } catch (e) {
    throw new UnauthorizedException('Credenciales inválidas');
  }
}
```

**Excepción:** try/catch es válido cuando se llama a APIs externas (Google OAuth, PostHog) donde la excepción original no es un `HttpException`.

---

## 8. Testing

### Unit tests

```typescript
import { Test, TestingModule } from '@nestjs/testing';

describe('FeatureService', () => {
  let service: FeatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
  });

  describe('methodName', () => {
    it('should do expected behavior', async () => {
      // Arrange
      // Act
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### E2E tests

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Feature (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/v1/feature (GET)', () => {
    return request(app.getHttpServer())
      .get('/v1/feature')
      .expect(200);
  });
});
```

### Reglas de testing

- Unit tests junto al archivo que testean: `auth.service.spec.ts` al lado de `auth.service.ts`
- E2E tests en `test/`
- Mockear `PrismaService` en unit tests — nunca la base de datos real
- Usar `Test.createTestingModule()` para inyección de dependencias
- Framework: Jest. **No** usar Vitest (ver ADR-001)

---

## 9. Swagger

### Decoradores obligatorios en todo controller

```typescript
@ApiTags('Nombre del Módulo')    // Siempre
@ApiBearerAuth()                 // Si requiere auth
```

### Decoradores obligatorios en todo método de controller

```typescript
@ApiOperation({ summary: 'Descripción corta en español' })   // Siempre
@ApiResponse({ status: 200, description: 'Descripción' })    // Al menos el caso exitoso
```

### Query params documentados

```typescript
@ApiQuery({ name: 'topic', required: false, example: 'ansiedad' })
@Get('exercises')
getExercises(@Query('topic') topic?: string) {}
```

---

## 10. Formateo y Estilo

### Prettier (enforced)

```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

- **Single quotes** en todo el código — nunca double quotes
- **Trailing commas** en todas las estructuras multilinea (arrays, objetos, parámetros)

### ESLint

- `@typescript-eslint/no-explicit-any`: **off** — se permite `any` (perfiles JSON flexibles, body de contenido)
- `@typescript-eslint/no-floating-promises`: **warn**
- `prettier/prettier`: **error** con `endOfLine: "auto"`

### TypeScript

- `strictNullChecks`: **habilitado**
- `noImplicitAny`: **deshabilitado** — se permite `any` explícito e implícito
- `experimentalDecorators` + `emitDecoratorMetadata`: **habilitado** (requerido por NestJS)
- Target: **ES2023**

---

## 11. Patrones de Prisma

### Filtros condicionales

Usar spread condicional, no construir `where` dinámicamente:

```typescript
// CORRECTO
where: {
  isPublished: true,
  ...(topic && { topic }),
  ...(type && { type }),
}

// INCORRECTO
const where: any = { isPublished: true };
if (topic) where.topic = topic;
if (type) where.type = type;
```

### Verificación de acceso premium

```typescript
const hasPremiumAccess =
  entitlement &&
  (entitlement.status === 'ACTIVE' || entitlement.status === 'TRIAL') &&
  (!entitlement.expiresAt || new Date() <= entitlement.expiresAt);
```

### Select para respuestas parciales

Cuando no se necesitan todos los campos, usar `select`:

```typescript
const users = await this.prisma.user.findMany({
  select: { id: true, email: true, role: true, createdAt: true },
  take: limit,
  orderBy: { createdAt: 'desc' },
});
```

---

## 12. Variables de Entorno

### Validación con Joi

Todas las variables se validan en `src/config/env.validation.ts`:

```typescript
import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  POSTHOG_API_KEY: Joi.string().optional().allow(''),
  POSTHOG_HOST: Joi.string().default('https://app.posthog.com'),
  GOOGLE_CLIENT_ID: Joi.string().required(),
});
```

### Acceso en servicios

```typescript
// Usar ConfigService inyectado
constructor(private configService: ConfigService) {}

const secret = this.configService.get<string>('JWT_SECRET');
const id = this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'); // Lanza si no existe
```

**Nunca** usar `process.env` directamente.

---

## 13. Qué Hacer y Qué NO Hacer

### HACER

- Crear un módulo NestJS independiente por cada feature
- Documentar cada endpoint con Swagger antes de implementar
- Verificar `docs/api-contracts.md` antes de crear o consumir endpoints
- Validar acceso premium en el **servicio**, no en el controller
- Verificar consentimiento (`consent.analytics`, `consent.sync`) antes de operar
- Usar `@CurrentUser()` para obtener el usuario del JWT
- Usar `select` en queries Prisma cuando no se necesitan todos los campos
- Mensajes de error en español para el usuario final
- Registrar acciones de admin en `AuditLog`
- Usar soft delete (`deletedAt`) para usuarios

### NO HACER

- **NO** poner lógica de negocio en controllers
- **NO** crear excepciones custom — solo las nativas de NestJS
- **NO** usar `req.user` directamente — usar `@CurrentUser()`
- **NO** usar `process.env` — usar `ConfigService`
- **NO** hacer try/catch en controllers
- **NO** hacer hard delete de usuarios
- **NO** enviar analytics sin verificar consentimiento
- **NO** sincronizar datos sin verificar consentimiento
- **NO** crear endpoints sin documentación Swagger
- **NO** crear endpoints protegidos sin `AuthGuard('jwt')`
- **NO** importar `firebase-admin` — fue reemplazado por `google-auth-library`
- **NO** usar `PartialType` de `@nestjs/mapped-types` — usar el de `@nestjs/swagger`
- **NO** hacer módulos `@Global()` sin ADR
- **NO** crear repositorios o wrappers sobre Prisma — llamadas directas
- **NO** usar double quotes en código — solo single quotes
- **NO** usar `import * as` para módulos que tienen named exports (excepto `bcrypt` y `Joi`)
