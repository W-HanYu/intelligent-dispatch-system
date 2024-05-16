import { Module } from '@nestjs/common';
import { UploadCustomAlgorithmController } from './uploadCustomAlgorithm.controller';

@Module({
  controllers: [UploadCustomAlgorithmController],
})
export class UploadCustomAlgorithmModule {}
