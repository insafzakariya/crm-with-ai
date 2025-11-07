import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountryService } from './country.service';

@ApiTags('countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({ status: 200, description: 'List of countries' })
  findAll() {
    return this.countryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a country by ID with states' })
  @ApiResponse({ status: 200, description: 'Country found' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  findOne(@Param('id') id: string) {
    return this.countryService.findOne(id);
  }
}
