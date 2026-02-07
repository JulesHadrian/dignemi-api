import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client'; // <--- 1. AGREGA 'Prisma' AQUÍ

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string): Promise<User> {
    return this.prisma.user.create({
      data: { email },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  // 2. CAMBIA EL TIPO AQUÍ: De 'Partial<User>' a 'Prisma.UserUpdateInput'
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
      return this.prisma.user.update({
          where: { id },
          data // Ahora TypeScript sabe que esto es seguro para enviar a la DB
      });
  }
}