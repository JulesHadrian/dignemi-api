import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Paso 1: Usuario pide entrar. Generamos un token temporal.
  async sendMagicLink(email: string) {
    // En producción: Aquí buscarías o crearías el usuario, o solo verificarías si existe.
    // Para MVP rápido "Growth": Creamos el usuario si no existe (Sign Up implícito)
    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      user = await this.usersService.create(email);
    }

    // Generamos un token de corta duración (15 min) solo para el login
    const payload = { email: user.email, sub: user.id, type: 'magic-link' };
    const token = this.jwtService.sign(payload, { expiresIn: '15m' });

    // SIMULACIÓN DE EMAIL (En prod: usar SendGrid/AWS SES)
    console.log(`\n📧 --- EMAIL SIMULADO --- 📧`);
    console.log(`Para: ${email}`);
    console.log(`Link: http://localhost:3000/v1/auth/callback?token=${token}`);
    console.log(`-----------------------------\n`);

    return { message: 'Magic link enviado (revisar consola del servidor)' };
  }

  // Paso 2: Usuario hace clic en el link. Validamos y damos el token real.
  async validateMagicLink(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'magic-link') {
        throw new UnauthorizedException('Token inválido');
      }

      const user = await this.usersService.findOneById(payload.sub);
      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      // Generamos el Access Token real (sesión larga)
      const sessionPayload = { email: user.email, sub: user.id, role: user.role, country: user.country };
      return {
        access_token: this.jwtService.sign(sessionPayload),
        user: user
      };
    } catch (e) {
      throw new UnauthorizedException('Link expirado o inválido');
    }
  }
}