import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Leemos el rol requerido desde el decorador (que haremos en el siguiente paso)
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // Si el endpoint no pide roles, pasa.
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Esto viene del JwtStrategy

    if (!user || !user.role) {
      throw new ForbiddenException('Usuario sin roles asignados');
    }

    // Verificamos si el rol del usuario está en la lista de permitidos
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException('No tienes permisos de Administrador');
    }

    return true;
  }
}
