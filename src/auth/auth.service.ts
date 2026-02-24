import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existing = await this.usersService.findOneByEmail(email);
    if (existing) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await this.usersService.create(email, passwordHash, name);

    const sessionPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      country: user.country,
    };

    return {
      access_token: this.jwtService.sign(sessionPayload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatarUrl,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        'Esta cuenta fue creada con Google. Por favor, inicia sesión con Google.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const sessionPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      country: user.country,
    };

    return {
      access_token: this.jwtService.sign(sessionPayload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatarUrl,
      },
    };
  }

  async googleLogin(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      const email = decodedToken.email;
      if (!email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const name = decodedToken.name || null;
      const picture = decodedToken.picture || null;

      const user = await this.usersService.findOrCreateByGoogle(
        email,
        name,
        picture,
      );

      const sessionPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        country: user.country,
      };

      return {
        access_token: this.jwtService.sign(sessionPayload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatarUrl,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
