import { Injectable, NotFoundException } from '@nestjs/common';
import { StateRepository } from './state.repository';
import { State } from '@prisma/client';

@Injectable()
export class StateService {
  constructor(private readonly stateRepository: StateRepository) {}

  async findAll(): Promise<State[]> {
    return this.stateRepository.findAll();
  }

  async findByCountry(countryId: string): Promise<State[]> {
    return this.stateRepository.findByCountry(countryId);
  }

  async findOne(id: string): Promise<State> {
    const state = await this.stateRepository.findOne(id);
    if (!state) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }
    return state;
  }
}
