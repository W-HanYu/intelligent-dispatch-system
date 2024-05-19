import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlgorithmsService } from './algorithms.service';
import { AlgorithmsController } from './algorithms.controller';
import { Algorithm } from './entities/algorithm.entity';
import { PredefinedParam } from './entities/predefined-param.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Algorithm, PredefinedParam])],
  providers: [AlgorithmsService],
  controllers: [AlgorithmsController],
})
export class AlgorithmsModule {}
