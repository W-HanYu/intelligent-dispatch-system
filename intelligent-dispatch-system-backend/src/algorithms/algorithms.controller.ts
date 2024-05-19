import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AlgorithmsService } from './algorithms.service';
import { Algorithm } from './entities/algorithm.entity';
import { PredefinedParam } from './entities/predefined-param.entity';

@Controller('algorithms')
export class AlgorithmsController {
  constructor(private readonly algorithmsService: AlgorithmsService) {}

  @Post()
  createAlgorithm(@Body() algorithm: Partial<Algorithm>): Promise<Algorithm> {
    return this.algorithmsService.createAlgorithm(algorithm);
  }

  @Post('params')
  createParam(
    @Body() param: Partial<PredefinedParam>,
  ): Promise<PredefinedParam> {
    return this.algorithmsService.createParam(param);
  }

  @Get()
  getAllAlgorithms(): Promise<Algorithm[]> {
    return this.algorithmsService.getAllAlgorithms();
  }

  @Get('initial_data')
  async getInitialData() {
    return await this.algorithmsService.insertInitialData();
  }

  // @Get(':id')
  // getAlgorithmById(@Param('id') id: number): Promise<Algorithm> {
  //   return this.algorithmsService.getAlgorithmById(id);
  // }
}
