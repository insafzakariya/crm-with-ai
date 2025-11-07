import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { State } from '@prisma/client';

@Injectable()
export class StateRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<State[]> {
    return this.prisma.state.findMany({
      orderBy: { name: 'asc' },
      include: { country: true },
    });
  }

  async findByCountry(countryId: string): Promise<State[]> {
    return this.prisma.state.findMany({
      where: { countryId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<State | null> {
    return this.prisma.state.findUnique({
      where: { id },
      include: { country: true },
    });
  }
}
