import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { CountryModule } from './country/country.module';
import { StateModule } from './state/state.module';

@Module({
  imports: [PrismaModule, CustomerModule, CountryModule, StateModule],
})
export class AppModule {}
