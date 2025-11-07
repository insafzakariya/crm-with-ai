import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StateService } from './state.service';

@ApiTags('states')
@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get()
  @ApiOperation({ summary: 'Get all states or filter by country' })
  @ApiQuery({ name: 'countryId', required: false })
  @ApiResponse({ status: 200, description: 'List of states' })
  findAll(@Query('countryId') countryId?: string) {
    if (countryId) {
      return this.stateService.findByCountry(countryId);
    }
    return this.stateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a state by ID' })
  @ApiResponse({ status: 200, description: 'State found' })
  @ApiResponse({ status: 404, description: 'State not found' })
  findOne(@Param('id') id: string) {
    return this.stateService.findOne(id);
  }
}
