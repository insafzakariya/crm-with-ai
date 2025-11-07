import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, Prisma } from '@prisma/client';

@Injectable()
export class CustomerRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({
      data,
      include: {
        country: true,
        state: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByWithRelationInput;
  }): Promise<{ customers: Customer[]; total: number }> {
    const { skip, take, where, orderBy } = params;

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          country: true,
          state: true,
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { customers, total };
  }

  async findOne(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        country: true,
        state: true,
      },
    });
  }

  async update(id: string, data: UpdateCustomerDto): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data,
      include: {
        country: true,
        state: true,
      },
    });
  }

  async remove(id: string): Promise<Customer> {
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
