import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Country } from '@prisma/client';

@Injectable()
export class CountryRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Country[]> {
    return this.prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string): Promise<Country | null> {
    return this.prisma.country.findUnique({
      where: { id },
      include: { states: true },
    });
  }
}
