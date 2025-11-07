import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CustomerService } from '../src/customer/customer.service';
import { CustomerRepository } from '../src/customer/customer.repository';
import { NotFoundException } from '@nestjs/common';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: CustomerRepository;

  beforeEach(() => {
    repository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    } as any;

    service = new CustomerService(repository);
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const expectedCustomer = { id: '1', ...createDto };
      vi.spyOn(repository, 'create').mockResolvedValue(expectedCustomer as any);

      const result = await service.create(createDto);

      expect(result).toEqual(expectedCustomer);
      expect(repository.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findOne', () => {
    it('should return a customer if found', async () => {
      const customer = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      vi.spyOn(repository, 'findOne').mockResolvedValue(customer as any);

      const result = await service.findOne('1');

      expect(result).toEqual(customer);
      expect(repository.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if customer not found', async () => {
      vi.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated customers', async () => {
      const customers = [
        { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      ];

      vi.spyOn(repository, 'findAll').mockResolvedValue({
        customers: customers as any,
        total: 2,
      });

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toEqual(customers);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });
  });
});
