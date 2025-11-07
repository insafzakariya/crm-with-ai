import { Injectable, NotFoundException } from '@nestjs/common';
import { CountryRepository } from './country.repository';
import { Country } from '@prisma/client';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async findAll(): Promise<Country[]> {
    return this.countryRepository.findAll();
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.countryRepository.findOne(id);
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }
}
